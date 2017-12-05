$(document).ready(function(){
    $.getJSON('/petowners', (data) => {

        data.sort((a,b) => {
            if (a.firstName < b.firstName) {
                return -1
            }
            if (a.firstName > b.firstName) {
                return 1;
            }
            return 0;
        });

        data.forEach((owner) => {
            $('.owner-list').append(`
                <li class="owner" data-id="${owner.pnr}">
                    ${owner.firstName} ${owner.lastName}
                </li>
            `);
        });
    });

    $('body').on('click', 'li', function() {
        loadOwnerData($(this).data('id'));
    });

    $('.add-owner-title').click(function() {
        $('.add-owner').show();
    });

    $('body').on('click', '.add-pet-btn', function() {
        console.log('hej');
        $('.add-pet').show();
    });

    $('body').on('click', '.add-owner-btn', function() {
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const pnr = $('#pnr').val();
        $.ajax({
            url: '/petowners',
            type: 'POST',
            data: JSON.stringify({
                pnr: pnr,
                firstName: firstName,
                lastName: lastName
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function() {
                console.log('Successfully added owner');
            }
        });
        location.reload();
    });

    $('body').on('click', '.delete-owner-btn', function() {
        const pnr = $('.delete-owner-btn').data('id');
        console.log(pnr);
        $.ajax({
            url: '/petowners/' + pnr,
            type: 'DELETE',
            success: function() {
                console.log('Successfully deleted owner');
            }
        });
        location.reload();
    });
});

function loadOwnerData(ownerPnr) {
    $('.owner-data').empty();
    $.getJSON('/petowners/' + ownerPnr, function(data) {
        if (data) {
            let owner = data[0];
            $('.owner-data').append(`
                <h4>${owner.firstName} ${owner.lastName}</h4>
            `)
        }
    });

    $.getJSON('/pets/' + ownerPnr, function(data) {
        if(data && data.length){
            data.forEach((pet) => {
                $('.owner-data').append(`
                    <div class="pet">
                        <h4>${pet.petName}</h4>
                        <p>${pet.species}</p>
                        <p>${pet.race}</p>
                    </div>
                `);
            });
        } else {
            $('.owner-data').append(`
                <div class="pet">
                    <p> This owner has no pets registered </p>
                </div>
            `);
        }
        $('.owner-data').append(`
            <button class="delete-owner-btn" data-id="${ownerPnr}">Delete owner</button>
            <button class="add-pet-btn">Add new Pet</button>
        `);
    });
    $('.owner-data').show();
}
