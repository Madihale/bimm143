// console.log("Transmembrane Image Carousel");
var cdnLocation = "https://cdn.rcsb.org";
var hdImagesLocation = cdnLocation + "/images/hd/";
var ruImagesLocation = cdnLocation + "/images/rutgers/";

$(function() {

    $('#carousel-structuregallery').carousel({
        interval: false
    });

    if ($("#carousel-structuregallery .imageCarouselItem").length === 1) {
        $("#Carousel-BiologicalUnit0").addClass("active");
    } else {
        let unitOneHTML = $("#Carousel-BiologicalUnit0 .carousel-header").html();
        if (unitOneHTML.includes("NMR Ensemble")) {
            $("#Carousel-BiologicalUnit0").addClass("active");
        } else {
            $("#Carousel-BiologicalUnit1").addClass("active");

        }
    }

    // Load CHIMERA Carousel Images with StructureSummary_Carousel.js file
    ChimeraImagesExist(structureId.toLowerCase());
});

function ChimeraImagesExist (pdbId) {
    var pdbIdListURL = hdImagesLocation + "pdbIdList.json";

    $.ajax({
        type: "GET",
        url: pdbIdListURL,
        dataType: "json",
        cache: true,
        success: function (data) {
            try {
                if (data["pdbIds"].indexOf(pdbId) > -1) {
                    loadChimeraImages(pdbId);
                } else {
                    loadRegularImages(pdbId);
                }
            }
            catch (exception) {
                console.log(exception + " Data not present pdbIdList.json");
            }
        },
        error: function (err) {
            console.log("ERROR: " + err + " | Could not retrieve list of PDB IDs");
            loadRegularImages(pdbId);
        }
    });
}

function loadRegularImages (pdbId) {
    var countItemCarousel = $("#carousel-structuregallery .item").length;

    var imageURL = "";
    for (var assembly = 0; assembly < countItemCarousel; assembly++) {
        // 0 = Asymmetric; 1+ = Biological Assembly
        var pdbHash = pdbId.toLowerCase().substr(1,2);
        if (assembly == 0) {
            imageURL = ruImagesLocation + pdbHash + "/" + pdbId.toLowerCase() + "/" + pdbId.toLowerCase() + ".pdb-500.jpg";
        } else {
            imageURL = ruImagesLocation + pdbHash + "/" + pdbId.toLowerCase() + "/" + pdbId.toLowerCase() + ".pdb"+assembly+"-500.jpg";
        }

        // Insert original image into Carousel
        $("#Carousel-BiologicalUnit" + assembly + " img").attr("src", imageURL);
        $("#Carousel-BiologicalUnit" + assembly + " .btn-enlargeImage").attr("href", imageURL);
    }

    // If it's just one item, remove the carousel controls
    if ($("#carousel-structuregallery .imageCarouselItem").length === 1) {
        $("#carousel-structuregallery .carousel-control").remove();
    }

    // Remove Chimera Related containers
    $("#carousel-structuregallery .galleryNewImages").remove();

}

function InsertChimeraImage(assembly, imageSrc350, imageSrc1000) {
    $("#Carousel-BiologicalUnit" + assembly + " img").attr("src", imageSrc350);
    $("#Carousel-BiologicalUnit" + assembly + " .btn-enlargeImage").attr("href", imageSrc1000);
}

function InitialInsertLegendText(filename_truncate, legend, assembly) {
    var legendText = "";
    $.map(legend, function(elem, index) {
        // Check to see if filename has a legend text associated with it
        if ((elem.source == null) && (elem.id == filename_truncate)) {
            legendText = elem.desc;

            // If Legend Exists
            var imageLegendAddMainImage =  "<span class='text-center legendTitleContainer'>" + legendText + "</span>";
            $(imageLegendAddMainImage).insertAfter("#Carousel-BiologicalUnit" + assembly + " .mainImage");
        }
    });
}

function loadChimeraImages (pdbId){
    var hashedDir =  pdbId.substring(1,3) + "/" + pdbId +"/";
    var detailedURL = hdImagesLocation + hashedDir + "index.json";
    var transmembraneCount = 0;

    $.ajax({
        type: "GET",
        url: detailedURL,
        dataType: "json",
        cache: true,
        success: function (data) {

            $("#galleryimagepanel").addClass("ChimeraImages");

            var pdbId = data["pdbId"];
            var bioAssemblies = data["nrAssemblies"];
            var filesArr = data["files"];
            var dataForGallery = data["data"];
            var legend = dataForGallery ["legend"];

            var transmembraneContainer = "";

            for (var assembly = 0; assembly <= bioAssemblies; assembly++){

                var files = filesArr[assembly];
                if (typeof files === undefined) {
                    continue;
                }

                var countImage = 0;

                var assemblyDiv = $("#AssemblyNewImage" + assembly);

                // Switching the MAIN image at initialization
                var imageSrc350 = hdImagesLocation + hashedDir + pdbId + "." + assembly + "_chimera_rainbow_chain_350_350.png";
                var imageSrc1000 = hdImagesLocation + hashedDir + pdbId + "." + assembly + "_chimera_rainbow_chain_1000_1000.png";
                var truncatedFilename = pdbId + "." + assembly + "_chimera_rainbow_chain";

                if(urlExists(imageSrc350) === 200) {
                    // Insert the Chimera image
                    InsertChimeraImage(assembly, imageSrc350, imageSrc1000);
                    InitialInsertLegendText(truncatedFilename, legend, assembly);

                }
                else {
                    console.warn("Assembly " + assembly + " cannot find Rainbow Chain image");

                    // Find the first file
                    var fileArrayLength = files.length;
                    for (var i = 0; i < fileArrayLength; i++) {
                        // Not Transmembrane membrane file
                        if ((files[i].indexOf("_chimera_tm_") == -1) && (files[i].endsWith("75_75.png"))) {
                            var file_truncate = files[i].substring(0,files[i].length - 10);
                            imageSrc350 = hdImagesLocation + hashedDir + file_truncate + "_350_350.png";
                            imageSrc1000 = hdImagesLocation + hashedDir + file_truncate + "_1000_1000.png";
                            InsertChimeraImage(assembly, imageSrc350, imageSrc1000);
                            InitialInsertLegendText(file_truncate, legend, assembly);

                            // After Finding the first file
                            break;
                        }
                    }
                }

                // Adding the thumbnail images at the bottom
                $.each(files, function(index, filename){
                    // console.log(index + "|" + filename);

                    if (filename.endsWith("75_75.png")) {
                        // Trim of 200_200.png and also any last character "_"
                        var filename_truncate = filename.substring(0,filename.length - 9);
                        var filename1000k = filename_truncate + "1000_1000.png";
                        var filename350 = filename_truncate + "350_350.png";
                        if (filename_truncate.substring(filename_truncate.length-1) == "_") {
                            filename_truncate = filename_truncate.substring(0, filename_truncate.length - 1);
                        }

                        var legendText = "";
                        var legendTextAltTag = "";
                        var opmImage = false;

                        $.map(legend, function(elem, index) {
                            // Check to see if filename has a legend text associated with it
                            if ((elem.source == null) && (elem.id == filename_truncate)) {
                                legendTextAltTag = " alt='" + elem.desc + "'";
                                // console.log(index + " | " + filename_truncate + " - " + elem.desc + " " + legendTextAltTag);
                            }
                            // Check to see if filename is related to OPM
                            if ((elem.source == "OPM") && (elem.id == filename_truncate)) {
                                // console.log(index + " Transmembrane Hit " + elem.id + " - " + elem.source);
                                // Flag - not included in the Asymmetric gallery
                                legendText = elem.desc + " <span class='label label-external hidden-print'><a href='http://opm.phar.umich.edu/protein.php?search=" + pdbId + "'>OPM</a></span>";
                                legendTextAltTag = " alt='" + elem.desc + " <span class=\"label label-external hidden-print\"><a href=\"http://opm.phar.umich.edu/\">OPM</a></span>'";
                                opmImage = true;
                                transmembraneCount += 1;
                            }
                        });

                        if (opmImage == false) {
                            var finalurl = "<div class='galleryimg'><img class='img-thumbnail' src='" + hdImagesLocation + hashedDir + filename + "'" + legendTextAltTag + "></div>";

                            $(finalurl).appendTo(assemblyDiv);

                            // Count the number of thumbnails
                            countImage += 1;

                        } else {
                            // Make sure there is at least one Transmembrane Image - Then Start BUILDING the Transmembrane UNIT
                            if (transmembraneCount == 1) {
                                transmembraneContainer += "<div class='item imageCarouselItem' id='Carousel-TransmembraneUnit'>";
                                transmembraneContainer += "<img src='" + hdImagesLocation + hashedDir + filename350 + "' class = 'img-responsive center-block mainImage'>" +
                                    "<span class='text-center legendTitleContainer'>" + legendText + "</span>" +
                                    "<a type='button' class='btn btn-default btn-xs btn-enlargeImage' data-toggle='lightbox' data-gallery='multiimagesMembrane' href='" + hdImagesLocation + hashedDir + filename1000k + "' data-title='" + filename1000k +  "'>" +
                                    "<span class='glyphicon glyphicon-resize-full' aria-hidden='true'></span>" +
                                    "</a><div class='carousel-header'>Transmembrane View</div>";
                                transmembraneContainer += "<div id='TransmembraneNewImage' class='galleryNewImages'>";
                            }

                            transmembraneContainer += "<div class='galleryimg'><img class='img-thumbnail' src='" + hdImagesLocation + hashedDir + filename + "'" + legendTextAltTag + "></div>";
                        }
                    }
                });

                if ((assembly >= 0) && (countImage < 5)) {
                    $("#Carousel-BiologicalUnit" + assembly).addClass("ShortGallery");
                }
            }

            // Add in the Transmembrane Container after Asymmetric Unit
            if (transmembraneContainer != "") {
                // Closing out the Transmembrane Container
                transmembraneContainer += "</div>";
                transmembraneContainer += "<div class='clearfix'></div>";
                transmembraneContainer += "<div class='carousel-footer hidden-print'><p><i class='fa fa-cube'></i> <strong>3D View</strong>: <a href='/3d-view/" + pdbId + "'>Structure</a>";

                // Variables set at image_gallery.pug
                if (structureHasEdMaps) {
                    transmembraneContainer += " | <span class='propernoun'><a href='/3d-view/" + pdbId + "?preset=electronDensityMaps'>Electron Density</a></span>";
                }
                if (structureFirstLigand) {
                    transmembraneContainer += " | <span class='propernoun'><a href='/3d-view/" + pdbId + "?preset=ligandInteraction&sele=" + structureFirstLigand + "'>Ligand Interaction</a></span>";
                }

                transmembraneContainer += "<hr><p><strong>Standalone Viewers</strong><br><a href='/pdb/explore/viewerLaunch.do?viewerType=PW&structureId=" + pdbId + "&unit=bio&unit_id=0'>Protein Workshop</a> | <a href='/pdb/explore/viewerLaunch.do?viewerType=LX&structureId=" + pdbId + "'>Ligand Explorer</a></p>";
                transmembraneContainer += "</div></div>";

                $(transmembraneContainer).insertAfter("#Carousel-BiologicalUnit0");

                // Because Transmembrane Unit Container exist, default it to show first
                $(".imageCarouselItem").removeClass("active");
                $("#Carousel-TransmembraneUnit").addClass("active");

                if ((transmembraneCount < 5)) {
                    $("#Carousel-TransmembraneUnit").addClass("ShortGallery");
                }

                // Default to Switching the MAIN image at initialization
                var defaultTMImage350 = hdImagesLocation + hashedDir + pdbId + ".0_chimera_tm_350_350.png";
                var defaultTMImage1000 = hdImagesLocation + hashedDir + pdbId + ".0_chimera_tm_1000_1000.png";
                var legendForDefaultTMImage = "transmembrane regions";

                if(urlExists(defaultTMImage350) == 200) {
                    // Insert the Chimera image
                    $("#Carousel-TransmembraneUnit .mainImage").attr("src", defaultTMImage350);
                    $("#Carousel-TransmembraneUnit .btn-enlargeImage").attr("href", defaultTMImage1000);
                    $("#Carousel-TransmembraneUnit .btn-enlargeImage").attr("data-title", defaultTMImage1000);
                    $("#Carousel-TransmembraneUnit .legendTitleContainer").remove();
                    var TMLegendAddMainImage =  "<span class='text-center legendTitleContainer'>" + legendForDefaultTMImage + " <span class=\"label label-external hidden-print\"><a href=\"http://opm.phar.umich.edu/protein.php?search=" + pdbId + "\">OPM</a></span></span>";
                    $(TMLegendAddMainImage).insertAfter("#Carousel-TransmembraneUnit .mainImage");


                }

            }
        },
        error: function (err) {
            console.log("ERROR: Failed to find new images for " + pdbId);
            $(".galleryNewImages").hide();
        }
    });
}

$(document).on('click', '.galleryimg img', function () {
    var imageURL = $(this).attr('src');
    var imageLegendText = $(this).attr('alt');

    var parentID = $(this).closest('.imageCarouselItem').attr('id');

    // Remove Active class, then add Active class to selected
    $("#" + parentID + " .galleryimg img").removeClass("active");
    $(this).addClass("active");

    var selectButtonEnlarge = "#" + parentID + " .btn-enlargeImage";
    var selectMainImage = "#" + parentID + " .mainImage";
    var lastMainImage = "#" + parentID + " .mainImage:last";

    // Reset the title span, remove the alt tag of main image
    $("#" + parentID + " .legendTitleContainer").remove();

    var trunkatedName = imageURL.substring(0,imageURL.length - 9);
    var finalurl1000 = trunkatedName + "1000_1000.png";
    var finalurl350 = trunkatedName + "350_350.png";

    var imageLegendAddToMainImage = "";
    if (imageLegendText !== undefined) {
        imageLegendAddToMainImage =  "<span class='text-center legendTitleContainer'>" + imageLegendText + "</span>";
    }

    var creationOfNewImage = "<img src='" + finalurl350 + "' class='img-responsive center-block mainImage'>";

    $(selectMainImage).hide();

    // Do not reload images already clicked on
    var imageAlreadyExist = false;
    $(selectMainImage).each(function() {
        if (this.src == finalurl350) {
            imageAlreadyExist = true;
            $(this).show();
        }
    });
    // On demand, retrieve image from server - lazy load
    if (imageAlreadyExist == false) {
        $("#" + parentID).prepend(creationOfNewImage);
    }


    $(selectButtonEnlarge).prop("data-title", false);
    $(selectButtonEnlarge).removeData('title');

    var downloadbutton = "<br><a role='button' target='_blank' class='btn btn-primary btn-xs' href='" + finalurl1000 + "'>Download High Resolution Image</a>";

    $(imageLegendAddToMainImage).insertAfter(lastMainImage);
    $(selectButtonEnlarge).attr("href", finalurl1000);
    $(selectButtonEnlarge).attr("data-title", finalurl1000 + downloadbutton);
    $(selectButtonEnlarge).data('title');


});
