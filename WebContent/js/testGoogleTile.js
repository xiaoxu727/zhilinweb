function main(){
		var map = L.map('map',{
				zoomControl: false,
				center: [ 0, 0 ],
				zoom: 3
		});
		L.tileLayer('http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',{
						attribution:'Google'
						}).addTo(map);
}
window.onload = main;
