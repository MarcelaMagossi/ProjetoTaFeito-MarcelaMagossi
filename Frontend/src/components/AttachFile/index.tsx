import React, {useEffect} from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { TokenProps, useAxios } from '../../hooks/useAxios';

import {Anexo} from '../../common/types';
import axios from 'axios';
import Delete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

type AttachFileProps = {
  anexo: Anexo;
  taskId: number;
}
const item = window.localStorage.getItem('token');
const tokenObj: TokenProps = JSON.parse(item!);

//const [showResults, setShowResults] = React.useState(true);

type ResponseGetAttachedFile = Blob;

const AttachFile = (props:AttachFileProps) => {
  const { taskId, anexo } = props;

  const {
    commit: commitDownloadAnexo,
    response,
    loading
  } = useAxios<ResponseGetAttachedFile>({
    method: 'GET',
    path: `tarefas/${taskId}/anexos/${anexo.id}`
  });

  useEffect(() => {
    if(response && !loading) {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', anexo.nome);
      document.body.appendChild(link);
      link.click();
    }
  }, [response, loading]);

  const downloadAnexo = () => {
    commitDownloadAnexo(
        undefined,
        undefined,
        undefined,
        'blob'
    );
  };
  const handleDeleteAttachment = async (taskId: number, anexo: Anexo) => {
    let response: any;
    console.log('tarefa:'+taskId);
    console.log('anexo:'+anexo.id);
    try {
      response = await axios({
        method: 'DELETE',
        url: `http://localhost:8080/tarefas/${taskId}/anexos/${anexo.id}`,
        headers: {
          Authorization: `Bearer ${tokenObj!.token}`
        },
      });
      window.location.reload();
      //setShowResults(false);
    } catch (error) {
      console.log('Erro ao excluir anexo da tarefa', error);
    }
  };

  return (
  <Stack direction='row' spacing={1}>
    <Tooltip title={`Excluir Anexo`}>
      <IconButton edge="end" aria-label="Excluir Anexo" component="span"
        onClick={
          () => {
            handleDeleteAttachment(taskId, anexo);
                }}>
            <Delete />
          </IconButton>
        </Tooltip>
        <ListItemButton sx={{ pl: 4 }} onClick={() => {downloadAnexo()}}>
          <ListItemText primary={anexo.nome} />
        </ListItemButton>
      </Stack>
  )
}

export default AttachFile;