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

    var addButton = $('#image-upload-button');
    var deleteButton = document.getElementById('image-delete-button');
    var img = document.getElementById('image-tag');
    var wrapper = $('#js-image-wrapper');
    var hidden = $('#img-hidden-field');
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
     * @private
     */
    var _uploaderActions = function () {
        customUploader.on('select', function () {
            var attachment = customUploader.state().get('selection').first().toJSON();
            var hiddenValue = hidden.val();
            var imageData = [];

            imageData.push({id: attachment.id, url: attachment.url})
            imageData.push(JSON.stringify(hiddenValue));
            hidden.val(JSON.stringify(imageData));

            console.log(imageData);
            //create image
            var image = $('<img/>');
            image.attr('class', "post-image");
            image.attr('src', attachment.url);
            image.attr('width', '100%');
            wrapper.append(image);

            //toggleVisibility( 'ADD' );
        });
    };
    /**
     * _onLoadHandls
     * @private
     */
    var _onLoadHandls = function () {
        window.addEventListener('DOMContentLoaded', function () {
            if ("" === customUploads.imageData || 0 === customUploads.imageData.length) {
                //toggleVisibility( 'DELETE' );
            } else {
                img.setAttribute('src', customUploads.imageData.src);
                hidden.setAttribute('value', JSON.stringify([customUploads.imageData]));
                toggleVisibility('ADD');
            }
        });
    };


    /*
     deleteButton.addEventListener( 'click', function() {
     img.removeAttribute( 'src' );
     hidden.removeAttribute( 'value' );
     toggleVisibility( 'DELETE' );
     } );*/

    /*
     var toggleVisibility = function( action ) {
     deleteButton.style.display = '';
     img.setAttribute( 'style', 'width: 100%;' );

     if ( 'DELETE' === action ) {
     deleteButton.style.display = 'none';
     img.removeAttribute('style');
     }
     };*/


    //publicly accessible functions
    return {
        init: init,
    };
}());

/**
 * Run post image javascript.
 */
postImages.init();