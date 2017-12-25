function getLuminance(bRed, bGreen , bBlue){
	return Math.floor( 0.298912 * bRed + 0.586611 * bGreen + 0.114478 * bBlue );
}

function set_median_filter(image_pix_data,img_width,img_height){
	var temp_pix_data = image_pix_data.slice();

	for(var pixx=0;pixx<img_width;pixx++){
		for(var pixy=0;pixy<img_height;pixy++){
			var left_side_pix = pixx-1;
			var right_side_pix = pixx+1;
			var up_side_pix = pixy-1;
			var bottom_side_pix = pixy+1;
			var start_x_pix;
			var end_x_pix;
			var start_y_pix;
			var end_y_pix;
			var pixindex=((img_width * pixy) + pixx) * 4;
			
			if(left_side_pix<0){
				start_x_pix=0;
			}else{
				start_x_pix=left_side_pix;
			}
			if(right_side_pix>=img_width){
				end_x_pix=img_width-1;
			}else{
				end_x_pix=right_side_pix;
			}
			if(up_side_pix<0){
				start_y_pix=0;
			}else{
				start_y_pix=up_side_pix;
			}
			if(bottom_side_pix>=img_height){
				end_y_pix=img_height-1;
			}else{
				end_y_pix=bottom_side_pix;
			}
			var pixArray = [];
			var countpixn=0;
			for(var px=start_x_pix;px<=end_x_pix;px++){
				for(var py=start_y_pix;py<=end_y_pix;py++){
					var pixindex_s=((img_width * py) + px) * 4;
					pixArray[countpixn++]=temp_pix_data[pixindex_s];
					if(pixArray[countpixn-1]!=255){
						console.log(pixArray[countpixn-1]);
					}
				}
			}
			var centernum =getCenterNum(pixArray,(end_x_pix-start_x_pix+1)*(end_y_pix-start_y_pix+1));

			if(image_pix_data[pixindex]!=centernum){
				console.log("temp:"+image_pix_data[pixindex]+",centernum:"+centernum);
				image_pix_data[pixindex] = centernum;
				console.log("temp:"+image_pix_data[pixindex]+",centernum:"+centernum);

			}
			if(image_pix_data[pixindex+1]!=centernum){
				console.log("temp:"+image_pix_data[pixindex+1]+",centernum:"+centernum);
				image_pix_data[pixindex+1] = centernum;
				console.log("temp:"+image_pix_data[pixindex+1]+",centernum:"+centernum);

			}
			if(image_pix_data[pixindex+2]!=centernum){
				console.log("temp:"+image_pix_data[pixindex+2]+",centernum:"+centernum);
				image_pix_data[pixindex+2] = centernum;
				console.log("temp:"+image_pix_data[pixindex+2]+",centernum:"+centernum);

			}
		}
	}
}

function getCenterNum(arraynum,index_n){
    var temp;
    for (var i = 0; i < index_n; i++) {
        for (var j = index_n; j > i; j--) {
            if (arraynum[j - 1] > arraynum[j]) {
                temp = arraynum[j];
                arraynum[j] = arraynum[j - 1];
                arraynum[j - 1] = temp;
            }
        }
    }
	return arraynum[parseInt(index_n/2,10)];
}

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
						var pixLuminance =getLuminance(imgpixdata[pixindex], imgpixdata[pixindex+1],
							imgpixdata[pixindex+2]);
						imgpixdata[pixindex] = pixLuminance;
						imgpixdata[pixindex+1] = pixLuminance;
						imgpixdata[pixindex+2] = pixLuminance;
					}
				}
				set_median_filter(imgpixdata,imgwidth,imgheight);
				cntxt.putImageData(imagedata,0,0);
			};
			tempimg.src = f_reader.result;
		}	
	},false);
});