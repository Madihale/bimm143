/**
 * Helper function to get values out of the URL
 */
function getQueryVariable(variable) {
    var urlSection = window.location.search.substring(1);
    if (typeof urlSection !== 'undefined') {
        var vars = urlSection.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    }
}

// Polyfill String.prototype.endsWith()
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

function findObjectInArrayByKey(key, key_value, array) {
    // Returns an array with that specific object
    return array.filter(function( obj ) {
        return obj[key] === key_value;
    });
}


// Check to see if image exist or not
function urlExists(testUrl) {
    var http = jQuery.ajax({
        type:"HEAD",
        url: testUrl,
        async: false,
        cache: true
    });
    return http.status;
    // this will return 200 on success, and 0 or negative value on error
}

// Check to see if Poseview image exist or not
function imageExistsPoseView(structureId,ligandId) {
    var poseViewStatus = $.ajax({
        async: false,
        dataType: "json",
        type: 'get',
        url: "/structure/poseview/"+structureId+"-"+ligandId
    });

    return poseViewStatus.responseJSON.poseView_img_status;
}

$(document).on('mouseenter', ".ellipsisToolTip", function () {
    var $this = $(this);

    if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
        $this.tooltip({
            title: $this.text(),
            placement: "right"
        });

        $this.tooltip('show');
    }
});


$(function () {
    // Variables from summary.pug. For MACROMOLECULE SECTION
    if ((proteinNumber > 0) && (dnaNumber > 0)) {
        $('#MacromoleculeTableDNA').hide();
        $('#MacromoleculeTable').show();
    }

    if ((proteinNumber > 0) && (dnaNumber = 0)) {
        $('#MacromoleculeTableDNA').hide();
        $('#MacromoleculeTable').show();
    }

    if ((proteinNumber = 0) && (dnaNumber > 0)) {
        $('#MacromoleculeTableDNA').show();
        $('#MacromoleculeTable').hide();
    }

    $("#MacromoleculesButton_Proteins").on("click",function () {
        //console.log("Macromolecule Section Proteins");
        $('#MacromoleculesButton_NucleicAcids').removeClass("active");
        $('#MacromoleculesButton_Proteins').addClass("active");
        $('#MacromoleculeTableDNA').hide();
        $('#MacromoleculeTable').show();
    });

    $("#MacromoleculesButton_NucleicAcids").on("click",function () {
        //console.log("Macromolecule Section Nucleic Acid");
        $('#MacromoleculesButton_Proteins').removeClass("active");
        $('#MacromoleculesButton_NucleicAcids').addClass("active");
        $('#MacromoleculeTable').hide();
        $('#MacromoleculeTableDNA').show();
    });

    // Tooltip activation
    $('[data-toggle="tooltip"]').tooltip();


    // STRUCTURE SUMMARY - Abstract Section
    $('#abstractFull').hide();
    $('#abstractFull').removeClass('hide');

    // Show Full Abstract Div
    $("#FullAbstract_Show").on("click",function() {
        $('#abstractPart').hide();
        $('#abstractFull').show();
    });

    // Hide Full Abstract Div
    $("#FullAbstract_Hide").on("click",function() {
        $('#abstractFull').hide();
        $('#abstractPart').show();
    });

});


