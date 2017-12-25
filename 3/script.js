function getLuminance(bRed, bGreen , bBlue){
	return Math.floor( 0.298912 * bRed + 0.586611 * bGreen + 0.114478 * bBlue );
}

function set_sobel_filter(image_pix_data, img_width, img_height) {
	var kernel_hs = [-1, 0, 1,
                     -2, 0, 2,
                     -1, 0, 1];
    var kernel_vs = [-1,-2,-1,
    				  0, 0, 0,
    				  1, 2, 1];
	var temp_pix_data = image_pix_data.slice();
    for (var i = 0; i < img_height; i++) {
        for (var j = 0; j < img_width; j++) {
            var dx = (j + i * img_width) * 4;
            var val_hs = [0,0,0];
            var val_vs = [0,0,0];
            for(var k = -1; k <= 1; k++){
                for(var l = -1; l <= 1 ; l++){
                    var x = j + l;
                    var y = i + k;
                    if(x < 0 || x >= img_width || y < 0 || y >= img_height){
                        continue;
                    }
                    var dx1 = (x + y * img_width) * 4;
                    var dx2 = (l + 1) + (k + 1) * 3;
                    val_hs[0] += kernel_hs[dx2]*temp_pix_data[dx1];
                    val_hs[1] += kernel_hs[dx2]*temp_pix_data[dx1 + 1];
                    val_hs[2] += kernel_hs[dx2]*temp_pix_data[dx1 + 2];

                    val_vs[0] += kernel_vs[dx2]*temp_pix_data[dx1];
                    val_vs[1] += kernel_vs[dx2]*temp_pix_data[dx1 + 1];
                    val_vs[2] += kernel_vs[dx2]*temp_pix_data[dx1 + 2];
                }
            }
            image_pix_data[dx] = Math.pow(val_hs[0]*val_hs[0]+val_vs[0]*val_vs[0],0.5);
            image_pix_data[dx + 1] = Math.pow(val_hs[1]*val_hs[1]+val_vs[1]*val_vs[1],0.5);
            image_pix_data[dx + 2] = Math.pow(val_hs[2]*val_hs[2]+val_vs[2]*val_vs[2],0.5);
        }
    }
};

window.addEventListener("DOMContentLoaded", function(){
	var ofo= document.getElementById('selectfile');
	ofo.addEventListener("change",function(evt){

		var tempimg = null;
		var inputfile = evt.target.files;
		var f_reader = new FileReader();

		f_reader.readAsDataURL(inputfile[0]);

		var cnvs = document.getElementById('resultcanvas');
		var cntxt = cnvs.getContext('2d');

		f_reader.onload = function(){
			tempimg = new Image();
			tempimg.onload = function(){
				var imgwidth = tempimg.width;
				var imgheight = tempimg.height;
				cnvs.width = imgwidth;
				cnvs.height = imgheight;
				cntxt.drawImage(tempimg,0,0);
				var imagedata = cntxt.getImageData(0,0,imgwidth,imgheight);

				var imgpixdata = imagedata.data;
				for(var pixx=0;pixx<imgwidth;pixx++){
					for(var pixy=0;pixy<imgheight;pixy++){
						var pixindex=((imgwidth * pixy) + pixx) * 4;
						var pixLuminance =getLuminance(imgpixdata[pixindex], imgpixdata[pixindex+1] , imgpixdata[pixindex+2]);
						imgpixdata[pixindex] = pixLuminance;
						imgpixdata[pixindex+1] = pixLuminance;
						imgpixdata[pixindex+2] = pixLuminance;
					}
				}
				
                set_sobel_filter(imgpixdata,imgwidth,imgheight);
				cntxt.putImageData(imagedata,0,0);
			}
			tempimg.src = f_reader.result;
		}	
	},false);
});