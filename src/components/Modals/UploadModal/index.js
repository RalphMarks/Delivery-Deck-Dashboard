import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {Image} from 'react-bootstrap';

function UploadModal(props) {
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      props.handle_file_upload(binaryStr);
      props.close_upload_modal();
    }

    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="modal-body">
      <div className="row">
        <div className="col-12">
          <h5>Importar Tareas</h5>
          <p>Selecciona un archivo CSV para importar las tareas</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Image style={{display: 'block', margin: '32px auto 0 auto'}} src="img/taskImportIcon.png" />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div style={{width:'160px', display:'block', margin: '24px auto 0 auto'}} {...getRootProps()} className="btn btn-primary">
            <input {...getInputProps()} />
            Seleccionar Archivo
          </div>
        </div>
      </div>
    </div>
  )
}


export default UploadModal;