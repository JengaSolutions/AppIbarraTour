function DataManager(root, archivo, data, url) {
	// Para cordova se debe tener el plugin de FileAPI
	// Peticion del sistema de archivos
	this.root = root;
	this.archivo = archivo;
	this.dir = null;
	this.init = function() {
		// window.requestFileSystem = window.requestFileSystem ||
		// window.webkitRequestFileSystem
			if (!(url === undefined) && navigator.onLine ) {
				
				var xmlhttp;
				if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome,
					// Opera, Safari
					xmlhttp = new XMLHttpRequest();
				} else {// code for IE6, IE5
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange = function() {
					alert(xmlhttp.statusText + " - " + xmlhttp.status + " - "
							+ xmlhttp.readyState);
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						data = xmlhttp.responseText;
						alert("Datos obtenidos " + data);
					}
				}
	
				xmlhttp.onprogress = function(evt) {
					$(pg).html(evt.loaded / evt.total * 100);
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
				alert("AJAX ENVIADO");
		}
			else if(!(url === undefined) && !navigator.onLine)
				alert("No hay conexión a internet.")
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getFS, fail);

	}

	// obtener directorio
	function getFS(fileSystem) {
		directoryEntry = fileSystem.root;
		dir = directoryEntry;
		directoryEntry.getDirectory(root, {
			create : true,
			exclusive : false
		}, getFileEntry, fail);
	}
	// obtener archivo
	function getFileEntry(fileSystem) {
		func = (typeof(data) == "function") ? getFileR : getFileW;
		fileEntry = fileSystem;
		fileEntry.getFile(archivo, {
			create : true,
			exclusive : false
		}, func, fail);
	}

	// manejo del archivo
	function getFileW(fileE) {
		fileE.createWriter(getWriter, fail);
	}

	// escritura del archivo
	function getWriter(writer) {
		alert("ES")
		writer.write(data);
	}
	// lectura de archivos
	function getFileR(fileE) {
		fileE.file(getReader, fail);

	}
	function getReader(file) {
		alert("LE"+file);
		reader = new FileReader();
		reader.onerror = function(e) {
			alert(e.message);
		}
		reader.onloadend = function(evt) {
			//lectura = evt.target.result;
			alert(evt.target.result);
			data(evt.target.result);
		};

		reader.readAsText(file);
	}
	
	

}

// errores
function fail(e) {
	var msg = '';

	switch (e.code) {
	case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
	case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	default:
		msg = 'Unknown Error';
		break;
	}
	;

	alert('Error: ' + msg);
}
function success(e) {
	alert(e.fullPath);
}