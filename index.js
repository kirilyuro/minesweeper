var minefield_height = 16,
    minefield_width = 30,
    mines = 99;

$(document).ready(function () {
    document.timeouts = [];
    drawSmiley();
    $('#menu_button').mouseenter(function () {
        $('#menu').css('box-shadow', '1px 1px 25px 1px orange');
        $(this).css('box-shadow', '-1px 1px 25px 1px orange');
        $(this).css('color', 'orange');
    });
    $('#menu_button').mouseleave(function () {
        $('#menu').css('box-shadow', '1px 4px 15px 2px black');
        $(this).css('box-shadow', '-4px 4px 15px 2px black');
        $(this).css('color', 'black');
    });
    $('#menu_button').click(onMenuButtonClick);
    $('#smiley').click(onSmileyClick);
    $(document).on('contextmenu', 'td, thead, table', function () { return false; });
    $(document).on('mousedown', '.flagged_cell', onFlaggedCellClick);
    $(document).on('mousedown', onDocumentMouseDown);
    $(document).on('mouseup', onDocumentMouseUp);
    $(document).on('click', '.num1, .num2, .num3, .num4, .num5, .num6, .num7, .num8', onOpenedNumCellClick);
    $(document).on('dblclick', '.num1, .num2, .num3, .num4, .num5, .num6, .num7, .num8', onOpenedNumCellDoubleClick);
});

function onMenuButtonClick() {
    if ($('#menu').is(':visible')) {    // menu closing
        setTimeout(function () { $('#timer').fadeIn(500); }, 500);
        setTimeout(function () { $('#mines_counter').fadeIn(300); }, 700);
        resumeGame();
    } else {
        $('#timer').fadeOut(500);
        $('#mines_counter').fadeOut(300);
        pauseGame();
    }
    $('#menu').animate({'width': 'toggle'}, 1000);
}

function pauseGame() {
    endgame();
}

function resumeGame() {
    $('.closed_cell_endgame').addClass('closed_cell')
    $('.closed_cell_endgame').removeClass('closed_cell_endgame');
    $('.flagged_cell_endgame').addClass('flagged_cell');
    $('.flagged_cell_endgame').removeClass('flagged_cell_endgame');
    document.timer_interval = setInterval(incrementTimer, 1000);
}

function onClosedCellClick(e) {
    if ($(this).hasClass('flagged_cell')) return;

    if (e.which === 3) {    // Right click
        toggleFlagged(parseInt($(this).attr('r')), parseInt($(this).attr('c')));
    } else openCell(this);
}

function onFlaggedCellClick(e) {
    if ($(this).hasClass('closed_cell')) return;

    if (e.which === 3) {    // Right click
        toggleFlagged(parseInt($(this).attr('r')), parseInt($(this).attr('c')));
    }
}

function onDocumentMouseDown(e) {
    if (e.which === 3) {
        document.rightMouseDown = true;
        // $(this).mouseleave(function () {
        //     this.rightMouseDown = false;
        //     $(this).off('mouseleave');
        // });
    }

    return true;
}

function onDocumentMouseUp(e) {
    if (e.which === 3) {
        document.rightMouseDown = false;
    }
    return true;
}

function onOpenedNumCellClick(e) {
    if ($(this).hasClass('empty_cell')) return;

    if (e.which !== 3 && document.rightMouseDown) {
        attemptOpenAdjacent(this);
    }
}

function onOpenedNumCellDoubleClick(e) {
    if ($(this).hasClass('empty_cell')) return;

    if (e.which !== 3) {
        attemptOpenAdjacent(this);
    }
}

function attemptOpenAdjacent(cell) {
    var r = parseInt($(cell).attr('r')),
        c = parseInt($(cell).attr('c')),
        adjacentCells = $(
            'td[r='+(r)+'][c='+(c+1)+'],' +
            'td[r='+(r)+'][c='+(c-1)+'],' +
            'td[r='+(r+1)+'][c='+(c+1)+'],' +
            'td[r='+(r+1)+'][c='+(c-1)+'],' +
            'td[r='+(r+1)+'][c='+(c)+'],' +
            'td[r='+(r-1)+'][c='+(c+1)+'],' +
            'td[r='+(r-1)+'][c='+(c-1)+'],' +
            'td[r='+(r-1)+'][c='+(c)+']'
        ),
        cellNum = parseInt($(cell).text()),
        adjacentFlagsCount = adjacentCells.filter('.flagged_cell').length;

    if (adjacentFlagsCount === cellNum) {
        adjacentCells.filter('.closed_cell').trigger('mousedown');
    }
}

function toggleFlagged(r, c) {
    var $e = $('td[r=' + r + '][c=' + c + ']');
    if ($e.hasClass('flagged_cell')) {
        $e.removeClass('flagged_cell');
        $e.addClass('closed_cell');
        $e.html('');
        incrementFlagsCounter(1);
    } else {
        $e.removeClass('closed_cell');
        $e.addClass('flagged_cell');
        $e.html('P');
        incrementFlagsCounter(-1);
    }
}

function incrementFlagsCounter(amount) {
    var $mines_count = $('#mines_counter');
    var curr_mines = parseInt($mines_count.val(), 10);
    var str_mines = '' + (curr_mines + amount);
    $mines_count.val(str_mines);
}

function onSmileyClick() {
    if ($('#minefield_div > p').is(':visible')) {
        $('#minefield_div > p').slideToggle(500);
    }

    $('#timer').val('000');
    $('#mines_counter').val('' + mines);
    $('table').css('display', 'none');
    clearInterval(document.timer_interval);
    for (var i in document.timeouts)
        clearTimeout(document.timeouts[i]);
    document.timeouts = [];
    initMines(mines);
    $('#minefield').empty();
    for (var i = 0; i < minefield_height; i++) {
        $('#minefield').append('<tr></tr>');
        for (var j = 0; j < minefield_width; j++) {
            $('#minefield > tr:last-child').append('<td class="closed_cell" r="' + i + '" c="' + j + '"></td>');
        }
    }
    $(document).on('mousedown', '.closed_cell', onClosedCellClick);
    document.timer_interval = setInterval(incrementTimer, 1000);
    $('table').fadeIn(1000);
}

function incrementTimer() {
    var $timer = $('#timer');
    var curr_time = parseInt($timer.val(), 10);
    if (curr_time === 999) {
        clearInterval(document.timer_interval);
        return;
    }
    var str_time = '' + (curr_time + 1);
    if (str_time.length === 1) {
        str_time = '00' + str_time;
    } else if (str_time.length === 2) {
        str_time = '0' + str_time;
    }
    $timer.val(str_time);
}

function drawSmiley() {
    var context = document.getElementById('smiley').getContext('2d');
    context.lineWidth = 3;

    // Head
    context.beginPath();
    context.arc(150, 75, 74, 0, 2 * Math.PI);
    context.stroke();

    // Left eye
    context.beginPath();
    context.arc(125, 60, 17, 0, 2 * Math.PI);
    context.stroke();
    context.beginPath();
    context.arc(131, 63, 8, 0, 2 * Math.PI);
    context.stroke();

    // Right eye
    context.beginPath();
    context.arc(175, 60, 17, 0, 2 * Math.PI);
    context.stroke();
    context.beginPath();
    context.arc(181, 63, 8, 0, 2 * Math.PI);
    context.stroke();

    // Mouth
    context.beginPath();
    context.arc(150, 75, 50, Math.PI/4, 3 * Math.PI/4);
    context.stroke();
}

function initMines(n_mines) {
    document.minefield = [];
    do {
        var r = Math.floor(Math.random() * minefield_height);
        var c = Math.floor(Math.random() * minefield_width);
        if (!isMineCell(r, c)) document.minefield.push([r,c]);
    } while (document.minefield.length < n_mines);
}

function isMineCell(r, c) {
    var minefield = document.minefield;
    for (var i = 0; i < minefield.length; i++) {
        if (minefield[i][0] === r && minefield[i][1] === c) return true;
    }
    return false;
}

function openCell(element) {
    var $e = $(element);
    if (!$e.hasClass('closed_cell')) return;

    $e.removeClass('closed_cell');
    var r = parseInt($e.attr('r')),
        c = parseInt($e.attr('c'));
    if (isMineCell(r, c)) {
        lose(r, c);
        return;
    }
    var mines_around = countMinesAround(r, c);
    if (mines_around > 0) openNum(r, c, mines_around);
    else openEmpty(r, c);
    if ($('.closed_cell').length + $('.flagged_cell').length === mines)
        win();
}

function openMine(r, c) {
    var $e = $('td[r=' + r + '][c=' + c + ']');
    if ($e.hasClass('flagged_cell_endgame')) return false;
    $e.addClass('mine_cell');
    $e.css('position', 'absolute');
    setTimeout(function () {
        $e.animate({'height': '23px', 'width': '23px'}, 50);
        setTimeout(function () { $e.css('position', 'static'); }, 60);
    }, 60);
    return true;
}

function openNum(r, c, mines_around) {
    var $e = $('td[r=' + r + '][c=' + c + ']');
    $e.css('display', 'none');
    $e.addClass('num' + mines_around);
    $e.html('' + mines_around);
    $e.fadeIn(200);
}

function openEmpty(r, c) {
    var $e = $('td[r=' + r + '][c=' + c + ']');
    $e.addClass('empty_cell');
    var timeouts = document.timeouts;
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r-1) + '][c=' + (c-1) + ']')); }, 50));
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r-1) + '][c=' + (c) + ']')); }, 50));
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r-1) + '][c=' + (c+1) + ']')); }, 50));
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r) + '][c=' + (c-1) + ']')); }, 50));
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r) + '][c=' + (c+1) + ']')); }, 50));
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r+1) + '][c=' + (c-1) + ']')); }, 50));
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r+1) + '][c=' + (c) + ']')); }, 50));
    timeouts.push(setTimeout(function () { openCell($('td[r=' + (r+1) + '][c=' + (c+1) + ']')); }, 50));
}

function countMinesAround(r, c) {
    var mines = 0;
    if (isMineCell(r-1, c-1)) mines++;
    if (isMineCell(r-1, c)) mines++;
    if (isMineCell(r-1, c+1)) mines++;
    if (isMineCell(r, c-1)) mines++;
    if (isMineCell(r, c+1)) mines++;
    if (isMineCell(r+1, c-1)) mines++;
    if (isMineCell(r+1, c)) mines++;
    if (isMineCell(r+1, c+1)) mines++;
    return mines;
}

function lose(r, c) {
    endgame();
    var $flags = $('.flagged_cell_endgame');
    for (var i = 0; i < $flags.length; i++) {
        var curr_r = parseInt($($flags[i]).attr('r')),
            curr_c = parseInt($($flags[i]).attr('c'));

        if (!isMineCell(curr_r, curr_c)) {
            $($flags[i]).html('X');
            $($flags[i]).fadeTo(500, 0.65);
        }
    }
    document.minefield.sort(distanceCompareFactory(r, c));
    openAllMines(0);
}

function win() {
    for (var i = 0; i < document.minefield.length; i++) {
        var r = document.minefield[i][0],
            c = document.minefield[i][1];

        if (!$('td[r=' + r + '][c=' + c + ']').hasClass('flagged_cell')) {
            toggleFlagged(r, c);
        }
    }
    endgame();
    $('#minefield_div > p').slideToggle(500);
}

function endgame() {
    $('.closed_cell').addClass('closed_cell_endgame');
    $('.closed_cell').removeClass('closed_cell');
    $('.flagged_cell').addClass('flagged_cell_endgame');
    $('.flagged_cell').removeClass('flagged_cell');
    clearInterval(document.timer_interval);
}

function openAllMines(i) {
    if (i >= document.minefield.length) return;

    var curr_mine = document.minefield[i];
    if (openMine(curr_mine[0], curr_mine[1])) {
        document.timeouts.push(setTimeout(function () { openAllMines(i+1); }, 100));
    } else openAllMines(i+1);
}

function distanceCompareFactory(r, c) {
    return function (cell1, cell2) {
        var dist1 = Math.sqrt(Math.pow(r-cell1[0], 2) + Math.pow(c-cell1[1], 2));    // sqrt((r-r1)^2 + (c-c1)^2) <=> dist(cell1, [r,c])
        var dist2 = Math.sqrt(Math.pow(r-cell2[0], 2) + Math.pow(c-cell2[1], 2));    // sqrt((r-r1)^2 + (c-c1)^2) <=> dist(cell2, [r,c])
        return dist1 - dist2;
    };
}
