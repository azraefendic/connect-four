(function() {
    var currentPlayer = "player1";
    var message = $("#message");
    var overlay = $(".overlay");
    var popup = $("#popup");
    var slots = $(".column").children();
    var buttonStart = $("#buttonStart");
    var button = $("#button");
    var popup1 = $(".popup1");
    var overlay1 = $(".overlay1");
    var winningSound;
    var square = $("#square");
    var victories = [
        [slots.eq(0), slots.eq(7), slots.eq(14), slots.eq(21)],
        [slots.eq(7), slots.eq(14), slots.eq(21), slots.eq(28)],
        [slots.eq(14), slots.eq(21), slots.eq(28), slots.eq(35)],
        [slots.eq(1), slots.eq(8), slots.eq(15), slots.eq(22)],
        [slots.eq(8), slots.eq(15), slots.eq(22), slots.eq(29)],
        [slots.eq(2), slots.eq(9), slots.eq(16), slots.eq(23)],
        [slots.eq(6), slots.eq(13), slots.eq(20), slots.eq(27)],
        [slots.eq(13), slots.eq(20), slots.eq(27), slots.eq(34)],
        [slots.eq(20), slots.eq(27), slots.eq(34), slots.eq(41)],
        [slots.eq(12), slots.eq(19), slots.eq(26), slots.eq(33)],
        [slots.eq(19), slots.eq(26), slots.eq(33), slots.eq(40)],
        [slots.eq(18), slots.eq(25), slots.eq(32), slots.eq(39)],
        [slots.eq(3), slots.eq(8), slots.eq(13), slots.eq(18)],
        [slots.eq(4), slots.eq(9), slots.eq(14), slots.eq(19)],
        [slots.eq(9), slots.eq(14), slots.eq(19), slots.eq(24)],
        [slots.eq(5), slots.eq(10), slots.eq(15), slots.eq(20)],
        [slots.eq(10), slots.eq(15), slots.eq(20), slots.eq(25)],
        [slots.eq(15), slots.eq(20), slots.eq(25), slots.eq(30)],
        [slots.eq(11), slots.eq(16), slots.eq(21), slots.eq(26)],
        [slots.eq(16), slots.eq(21), slots.eq(26), slots.eq(31)],
        [slots.eq(21), slots.eq(26), slots.eq(31), slots.eq(36)],
        [slots.eq(17), slots.eq(22), slots.eq(27), slots.eq(32)],
        [slots.eq(22), slots.eq(27), slots.eq(32), slots.eq(37)],
        [slots.eq(23), slots.eq(28), slots.eq(33), slots.eq(38)]
    ];

    // Checking if the game is reloaded with a button with .hash property (so if it is the welcome popup should not appear
    // If the game is loaded for the first time the popup will appear after 0.5sec.
    if (document.location.hash === "") {
        setTimeout(function() {
            popup1.addClass("on");
            overlay1.addClass("on");
            buttonStart.on("click", function() {
                popup1.removeClass("on");
                overlay1.removeClass("on");
                var soundH = new Audio("assets/audio/happy.mp3");
                soundH.play();
            });
        }, 500);
    } else {
        // Clearing the .hash property so that the popup shows up when the game is first loaded
        document.location.hash = "";
    }

    // Function for declaring victory. Popup with victory message appears every time there is a victory, but a different one for each player
    function declareVictory() {
        if (currentPlayer == "player1") {
            message.addClass("color1");
            message.html("THE LIGHT SIDE OF THE FORCE WINS!");
            winningSound = new Audio("assets/audio/theme.mp3");
            winningSound.play();
        } else {
            message.addClass("color2");
            message.html("THE DARK SIDE OF THE FORCE WINS!");
            winningSound = new Audio("assets/audio/march.mp3");
            winningSound.play();
        }
        popup.css({
            visibility: "visible"
        });
        overlay.addClass("on");
    }

    // Adding a click event for the columns. Checking which one was clicked on and adding classes to the first available slot in it.
    $(".column").on("click", function(e) {
        var sound = new Audio("assets/audio/sound.mp3");
        sound.play();
        var col = $(e.currentTarget);
        var slotsInCol = col.children();
        //loop through the slots and find the one that's empty
        for (var i = slotsInCol.length - 1; i >= 0; i--) {
            if (
                !slotsInCol.eq(i).hasClass("player1") &&
                !slotsInCol.eq(i).hasClass("player2")
            ) {
                slotsInCol.eq(i).addClass(currentPlayer);
                break;
            }
        }
        // If there is no more available slots in the column do nothing
        if (i == -1) {
            return;
        }

        // Checking for victories, and declaring a victory with a 1sec delay.Also added a clash function for the photos and the animation.
        // If there is no victory switch players.
        var slotsInRow = $(".row" + i);
        if (
            checkForVictory(slotsInCol) ||
            checkForVictory(slotsInRow) ||
            diagonalCheck(victories)
        ) {
            clash();
            $(".column").off("click");
            setTimeout(function() {
                declareVictory();
            }, 1000);
        } else {
            switchPlayers();
        }
    });

    // Function for checking row and column victories. Checks if there are 4 slots with a same class next to each other.
    // If there is returns true, if there is not resets count.
    function checkForVictory(slots) {
        //loop through all of the slots
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                count++;
                console.log(count);
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    // Function for checking diagonal victories. Checks for matches with the previously defined array of possible win combinations.
    function diagonalCheck(victories) {
        for (var i = 0; i < victories.length; i++) {
            var arr = victories[i];
            if (
                arr[0].hasClass(currentPlayer) &&
                arr[1].hasClass(currentPlayer) &&
                arr[2].hasClass(currentPlayer) &&
                arr[3].hasClass(currentPlayer)
            ) {
                return true;
            }
        }
    }

    // Animation function. Adding a second lightsaber 0.3sec before the first one dissapears. Adding animation classes with transform:rotate to both of them.
    // This makes it look like they are clashing
    function anim() {
        $("#lightsaber2").addClass("animation2");
        setTimeout(function() {
            $("#lightsaber2").removeClass("animation2");
        }, 300);
        $("#lightsaber1").addClass("animation");

        setTimeout(function() {
            $("#lightsaber1").removeClass("animation");
        }, 300);
    }

    // Clash function so I can have both lightsabers on screen and the animation one more time after the last move.
    function clash() {
        $("#lightsaber1").removeClass("off");
        $("#lightsaber2").removeClass("off");
        $("#lightsaber2").addClass("on");
        anim();
    }

    // Function for switching players. It also adds and removes lightsabers' visibility so that the one on screen indicates players turn.
    // Added some setTimeout so it looks nicer.
    function switchPlayers() {
        if (currentPlayer == "player1") {
            currentPlayer = "player2";
            setTimeout(function() {
                $("#lightsaber2").removeClass("off");
                setTimeout(function() {
                    $("#lightsaber1").addClass("off");
                }, 300);
                $("#lightsaber2").addClass("on");
                anim();
            }, 400);
        } else {
            currentPlayer = "player1";
            setTimeout(function() {
                $("#lightsaber1").removeClass("off");
                setTimeout(function() {
                    $("#lightsaber2").addClass("off");
                }, 300);
                anim();
            }, 400);
        }
    }

    // New game button click event. Paused the winning sound so I could play happy confirmation sound.
    // Added a hash property to mark when the new game should start with reloading the page. Used this later to help controle the welcome popup window.
    // Delayed the page reload for 1 sec so the changes are visible.
    button.click(function() {
        winningSound.pause();
        var soundH = new Audio("assets/audio/happy.mp3");
        soundH.play();
        document.location.hash = "reloaded";
        setTimeout(function() {
            document.location.reload(true);
        }, 1100);
    });
})();
