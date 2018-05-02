$=jQuery

function hacerControl(){
	var previo=null;

    var o={}
	
	o.obtenerPrevio=function(){
		return previo;
	}
	
	o.limpiar=function(){
		o.grafo={
			vertices:[],
			aristas:[]
		}
		previo=null;
	}
	
	o.limpiar()

    o.clickea=function(x,y,ctrl,alt){
        console.log(x,y,ctrl,alt)
        
		var cercano=null
		o.grafo.vertices.forEach(function(v){
			if( (x-v.x)*(x-v.x) + (y-v.y)*(y-v.y) <= 20*20){
				cercano=v
			}
		})
		
		if(cercano!=null && previo==null){
			previo=cercano
			return;
		}
		
		//aregar vertice
        if(cercano==null){
			var v={x:x,y:y}
			o.grafo.vertices.push(v)
			previo=null
			return;
		}
		
		if(cercano!=null && previo !=null && previo!=cercano){
			o.grafo.aristas.push({
				x1:cercano.x,
				y1:cercano.y,
				x2:previo.x,
				y2:previo.y
			})
			previo=null
			return;
		}
		
		if(cercano!=null && previo==cercano){
			previo=null
			return;
		}
		
		
    }

    

    return o;
}

function crearTexto(grafo){
	return grafo.aristas.map(function(a){
		return a.x1+" "+a.y1+" - "+a.x2+" "+a.y2
	}).join("\n");
	
}

function redibujar(ctx,grafo,previo){
    ctx.clearRect(0,0,800,800);
    

	grafo.aristas.forEach(function (a){
		ctx.strokeStyle="yellow"
		ctx.beginPath();
        ctx.moveTo(a.x1,a.y1)
        ctx.lineTo(a.x2,a.y2);
        ctx.stroke();
		
	})
	
	grafo.vertices.forEach(function(v){
		ctx.fillStyle="yellow"
		if(previo==v){
			ctx.fillStyle="red"
		}
		ctx.moveTo(v.x,v.y)
        ctx.beginPath();
        ctx.arc(v.x,v.y,20,0,2*Math.PI);
        ctx.fill()
        
        ctx.fillStyle="black"
        ctx.fillText(""+v.x+","+v.y,v.x,v.y)
	})
	
	
}

$(document).ready(function(){
    console.log("hola?")

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    var control=hacerControl()



    $(canvas).on("click",function(e){
        control.clickea(e.offsetX,e.offsetY,e.ctrlKey,e.altKey)
        console.log(e)
        redibujar(ctx,control.grafo,control.obtenerPrevio())
        $("#paracopiar").text(crearTexto(control.grafo))
    })
    
    $("#limpiar").on("click",function(){
		control.limpiar();
		redibujar(ctx,control.grafo,control.obtenerPrevio())
		$("#paracopiar").text(crearTexto(control.grafo))
	});
	
	$("#copiar").on("click",function(){
		$("#paracopiar").select();
		document.execCommand("copy")
	});

})

