import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const promises: Promise<boolean>[] = [];

    async function sendForm(file: File): Promise<boolean> {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const importResponse = await api.post('/transactions/import', formData);
        return importResponse.status === 200;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

    uploadedFiles.forEach(file => {
      promises.push(sendForm(file.file));
    });

    Promise.all(promises).then(res => {
      if (res.every(el => el === true)) {
        setUploadedFiles([]);
        history.push('/');
      } else {
        console.error('Erro no envio!');
      }
    });
  }

  function submitFile(files: File[]): void {
    const filesToUpload: FileProps[] = files.map(file => {
      return {
        name: file.name,
        readableSize: filesize(file.size),
        file,
      };
    });
    setUploadedFiles([...uploadedFiles, ...filesToUpload]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
