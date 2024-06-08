let VIDEO=null
let CANVAS=null
let CONTEXT=null

function main(){ 
    CANVAS=document.getElementById("myCanvas")
    CONTEXT=CANVAS.getContext("2d")
    CANVAS.width = 1350;
    CANVAS.height = 1350;
 

    // let promise = navigator.mediaDevices.getUserMedia({video:true});
    let promise = navigator.mediaDevices.getUserMedia({video : {
        facingMode: {exact:"environment"}
    }});

    promise.then(function(signal){
        VIDEO=document.createElement("video")
        VIDEO.srcObject=signal
        VIDEO.play()
        VIDEO.onloadeddata = function() {
            updateCanvas()
        }
    }).catch(function(err){
        alert("camera error: "+err)
    })
}


function updateCanvas(){
    CONTEXT.drawImage(VIDEO, 0, 0)
}