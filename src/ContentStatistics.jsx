



import React, { useState, useEffect } from 'react';
import { Descriptions, Typography, Divider, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadSideCough, faUserSlash, faGlobeAmericas, faFlag } from '@fortawesome/free-solid-svg-icons';
import './ContentStatistics.css';

const { Title } = Typography;

const RenderContent = () => {
  const column = 1;
  const [ativos, setAtivos] = useState(21088);
  // const [recuperados, setRecuperados] = useState('-');
  const [fatais, setFatais] = useState(1230);

  useEffect(() => {
    fetch('https://api.apify.com/v2/key-value-stores/TyToNta7jGKkpszMZ/records/LATEST?disableRedirect=true').then(res => res.json()).then(data => {
      console.log(data);
      setAtivos(data['infected']);
      // setRecuperados(data['recovered']);
      setFatais(data['deceased']);
    });
  }, []);

  return (
    <Descriptions size="small" column={column} layout="vertical">
      <Descriptions.Item> <Title level={4}><FontAwesomeIcon icon={faFlag} /> Casos no Brasil</Title></Descriptions.Item>
      <Descriptions.Item> <FontAwesomeIcon icon={faHeadSideCough} /> Casos ativos: <span><Tag color="cyan">{ativos.toLocaleString('pt-BR')}</Tag></span></Descriptions.Item>
      {/*<Descriptions.Item> <FontAwesomeIcon icon={faHeadSideMask} /> Casos recuperados: <span>{recuperados}</span></Descriptions.Item>*/}
      <Descriptions.Item> <FontAwesomeIcon icon={faUserSlash} /> Casos fatais: <span><Tag color="red">{fatais.toLocaleString('pt-BR')}</Tag></span></Descriptions.Item>
    </Descriptions>
  );
}

const ExtraContent = () => {
  const column = 1;
  const [ativos, setAtivos] = useState(1864629);
  // const [recuperados, setRecuperados] = useState({});
  const [fatais, setFatais] = useState(115286);

  useEffect(() => {
    fetch('https://coronavirus-19-api.herokuapp.com/all').then(res => res.json()).then(data => {
      console.log(data);
      setAtivos(data['cases']);
      setFatais(data['deaths']);
    });
  }, []);

  return (
    <Descriptions size="small" column={column} layout="vertical" className="statistic-world">
      <Descriptions.Item> <Title level={4}><FontAwesomeIcon icon={faGlobeAmericas} /> Casos no Mundo</Title></Descriptions.Item>
      <Descriptions.Item> <FontAwesomeIcon icon={faHeadSideCough} /> Casos ativos: <span><Tag color="cyan">{ativos.toLocaleString('pt-BR')}</Tag></span></Descriptions.Item>
      <Descriptions.Item> <FontAwesomeIcon icon={faUserSlash} /> Casos fatais: <span><Tag color="red">{fatais.toLocaleString('pt-BR')}</Tag></span></Descriptions.Item>
    </Descriptions>
  );
}

const ContentStatistics = () => {
  return (
    <div className="content-statistics">
      <div className="content-statistics-main"><RenderContent /></div>
      <Divider type="vertical" style={{ height: '130px' }} />
      <div className="content-statistics-extra"><ExtraContent /></div>
    </div>
  );
};

export default ContentStatistics;