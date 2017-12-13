$(document).ready(function(){
    let activeOwnerPnr;

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
        const pnr = $(this).data('id');
        loadOwnerData(pnr);
        activeOwnerPnr = pnr;
        console.log('active: ', activeOwnerPnr);
    });

    $('.add-owner-title').click(function() {
        $('.add-owner').show();
    });

    $('body').on('click', '.show-add-pet-btn', function() {
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

    $('body').on('click', '.add-pet-btn', function() {
        const name = $('#name').val();
        const birthDate = $('#birthDate').val();
        const species = $('#species').val();
        const race = $('#race').val();
        console.log(name,birthDate,species,race);
        $.ajax({
            url: '/pets',
            type: 'POST',
            data: JSON.stringify({
                pet: {
                    name: name,
                    birthDate: birthDate,
                    species: species,
                    race: race
                },
                pnr: activeOwnerPnr
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function() {
                console.log('Successfully added pet to owner');
                $('.add-pet').find('input').val('');
                $('.add-pet').hide();
                loadOwnerData(activeOwnerPnr);
            }
        });
    });

    $('body').on('click', '.delete-owner-btn', function() {
        $.ajax({
            url: '/petowners/' + activeOwnerPnr,
            type: 'DELETE',
            success: function() {
                console.log('Successfully deleted owner');
            }
        });
        location.reload();
    });

    $('body').on('click', '.delete-pet-btn', function() {
        const petId = $(this).closest('.pet').data('id');
        console.log(petId);
        $.ajax({
            url: '/pets/' + petId,
            type: 'DELETE',
            success: function() {
                console.log('Successfully deleted owner');
            }
        });
        loadOwnerData(activeOwnerPnr);
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
        if (data && data.length) {
            data.forEach((pet) => {
                $('.owner-data').append(`
                    <div class="pet" data-id="${pet.id}">
                        <h4>${pet.petName}</h4>
                        <p>Species: ${pet.species}</p>
                        <p>Race: ${pet.race}</p>
                        <button class="delete-pet-btn">
                            Delete this pet
                        </button>
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
        $('.owner-controls').show();
    });
    $('.owner-data').show();
}
