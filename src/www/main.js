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
                <li class="owner" data-id="${owner.pnr}">${owner.firstName} ${owner.lastName}</li>
            `);
        });
    });

    $('body').on('click', 'li', function() {
        loadOwnerData($(this).data('id'));
    });
});

function loadOwnerData(ownerPnr) {
    $('.owner-data').empty();
    $.getJSON('/pets/' + ownerPnr, function(data) {
        console.log(data);
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
    });
    $('.owner-data').show();
}
