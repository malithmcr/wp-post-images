/**
 * post-images.js used only in admin.
 * Plugin Name: Post Images
 * Plugin URI: http://malith.pro
 * Description: Awesome image upload for wordpress posts.
 * Author: Malith Priyashan
 * Author URI: http://malith.pro
 * Version: 1.0.0
 * Text Domain: post-image
 * License: GPLv2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */
    var postImages = (function () {

    var addButton = $('#post-image-upload-button');
    var deleteButton = $('#post-image-image-delete-button');
    var wrapper = $('#js-image-wrapper');
    var hidden = $('#img-hidden-field');
    var imageData = [];
    /**
     * Init wordpress media uploader.
     */
    var customUploader = wp.media({
        title: 'Select an Image',
        button: {
            text: 'Use this Image'
        },
        multiple: false
    });

    /**
     * Initializes method.
     */
    var init = function () {
        _openUploader();
        _uploaderActions();
        _onLoadHandls();
    };
    /**
     * _openUploader
     * @private
     */
    var _openUploader = function () {
        addButton.on('click', function () {
            if (customUploader) {
                customUploader.open();
            }
        });
    };
    /**
     * _uploaderActions
     * @param data { obj }
     * @private
     */
    var _craeteImage = function (data) {
        //create image
        var image = $('<img/>');
        image.attr('class', "post-image");
        image.attr('src', data.url);
        image.attr('width', '100%');
        wrapper.append(image);
    };
    /**
     * _uploaderActions
     * @private
     */
    var _uploaderActions = function () {
        customUploader.on('select', function () {
            var attachment = customUploader.state().get('selection').first().toJSON();
            imageData.push({id: attachment.id, url: attachment.url})
            hidden.val(JSON.stringify(imageData));
            //create image
            _craeteImage(attachment);
            //Show delete button
            deleteButton.show();
        });
    };
    /**
     * deleteImages
     * this will delete all the images. but will add delete button
     * for each of image.
     * @public
     */
    var deleteImages = function () {
        var confirmed = confirm("Are you sure to delete images ?");
        if (confirmed == true) {
            hidden.val('');
            wrapper.empty();
        }

    };
    /**
     * _onLoadHandls
     * @private
     */
    var _onLoadHandls = function () {
        window.addEventListener('DOMContentLoaded', function () {

            if ("" !== customUploads.imageData || 0 !== customUploads.imageData.length) {
                var images = JSON.parse(customUploads.imageData);
                imageData = images;
                deleteButton.show();
                //create image
                if(images) {
                    for(var i=0; i <= images.length; i++) {
                        if(images[i]) {
                            _craeteImage(images[i]);
                        }
                    }
                }
            }

        });
    };


    //publicly accessible functions
    return {
        init: init,
        deleteImages: deleteImages,
    };
}());

/**
 * Run post image javascript.
 */
postImages.init();