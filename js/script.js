$(document).ready(function() {

	/************************ THEME CONTROL ************************/
    
    $('#dark').on('click', function() {
        $('#thm').attr('href', 'css/theme_dark.css');      
    });
    
    $('#normal').on('click', function() {
        $('#thm').attr('href', 'css/theme_normal.css');      
    });
    
    $('#orange_blue').on('click', function() {
        $('#thm').attr('href', 'css/theme_orange_blue.css');      
    });

    /************************ GAME CONTROL **************************/

    $('#tic').on('click', function() {
        $('#tictactoe').show();
        $('#puissance4').hide();
        $('#grid_control').removeClass('p4').addClass('tic');
    });

    $('#p4').on('click', function() {
        $('#tictactoe').hide();
        $('#puissance4').show();
        $('#grid_control').removeClass('tic').addClass('p4');
    });

});