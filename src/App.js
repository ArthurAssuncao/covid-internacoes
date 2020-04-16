import React, { useState, useEffect } from 'react';
import './App.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea, Label, ResponsiveContainer
} from 'recharts';
import { Helmet } from 'react-helmet';
import { Layout, PageHeader, Divider, Typography, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVirus } from '@fortawesome/free-solid-svg-icons';
import {withGetScreen} from 'react-getscreen'
import ReactGA from 'react-ga';
import logo from './virus-icon.png';

import ContentStatistics from './ContentStatistics';

const { Text, Title, Paragraph } = Typography;
const { Header, Footer, Content } = Layout;

ReactGA.initialize('UA-163325072-1');

const App = (props) => {
  const [brasil, setBrasil] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const urlFonteInfoGripe = "<http://info.gripe.fiocruz.br/>";
  const urlFonteCovidBrasil = "<https://apify.com/pocesar/covid-brazil>";
  const urlFonteCovidMundo = "<https://github.com/javieraviles/covidAPI>";

  useEffect(() => {
    fetch('https://covid-internacoes.firebaseio.com/brasil.json').then(res => res.json()).then(data => {
      console.log('Brasil: ', data);
      setBrasil(data);
    });
    fetch('https://covid-internacoes.firebaseio.com/regioes.json').then(res => res.json()).then(data => {
      console.log('Regioes: ', data);
      setRegioes(data);
    });
  }, []);

  const getAspect = () => {
    if (props.isMobile()){
      return 1;
    }
    return 1.6;
  }

  const generateRange = (start, end, step) => {
      if (props.isMobile()){
        step = step * 2;
      }
      const array = [];
      const y = start - end > 0 ? start - end : end - start;
      for (let i=start; i <= y; i += step) {
          array.push(i);
      }
      return array;
  }

  const generateYAxisLabel = () => {
    if (props.isMobile()){
      return "Por 100 mil habitantes";
    }
    return "Incidência de SRAG (por 100 mil habitantes)";
  }

  const fixLegend = (value, name) => {
    return (<span className="grafico-text">{value.replace('_', ' a ')}</span>);
  }

  const fixTickX = (props) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dx={20}
          dy={13}
          textAnchor="end"
          fill="#666"
          className="grafico-text"
        >
          {payload.value}
        </text>
      </g>
    );
  }

  const fixTickY = (props) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={5}
          textAnchor="end"
          fill="#666"
          className="grafico-text"
        >
          {payload.value}
        </text>
      </g>
    );
  }

  const fixTooltip = (value) => value.toFixed(2);

  const fixLabelTooltip = (value) => value.replace('_', ' a ');

  const yAxisRange = generateRange(0, 5.5, 0.5);

  return (
    <div className="App">
      <Helmet>
        <title>Covid-19 Internações Hospitalares</title>
        <meta name="author" content="Arthur Assunção" />
        <meta name="dcterms.rightsHolder" content="Arthur Assunção" />
        <meta name="description" content="Covid Internações: O número de intenações por casos respiratórios causados pelo corona vírus" />
        <meta name="keywords" content="Covid, Covid-19, Corona Vírus, Internacoes, Casos" />
        <link rel="icon" type="image/png" href={logo} />
      </Helmet>
      <Layout className="layout">
        <Header className="header">
          <div className="title">
            <PageHeader
              className="site-page-header-responsive"
              title="Covid-19 Internações hospitalares - Brasil"
              subTitle="Crescimento das internações por problemas respiratórios"
              avatar={{ icon: <FontAwesomeIcon icon={faVirus} /> }}
              >
              <Divider />
              <ContentStatistics />
            </PageHeader>
          </div>
        </Header>
        <Content className="content">
          <section className="section-grafico">
            <Title level={4}>Brasil: Incidência de hospitalizados por problemas respiratórios*</Title>
            <div className="parentGrid grafico-container">
              <div className="rodoabad">
                <ResponsiveContainer aspect={1.5}>
                  <LineChart
                    width={600}
                    height={400}
                    className="grafico"
                    data={brasil}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <XAxis dataKey="epiweek_label" tick={fixTickX} height={50} tickSize={2} padding={{ top: 10 }} label={<Label
                        value="Semana do ano"
                        className="grafico-text"
                        />} />
                    <YAxis interval={0} type="number" tick={fixTickY} domain={[0, 'dataMax + 0.5']} ticks={yAxisRange}>
                      <Label
                        value={generateYAxisLabel()}
                        position="insideLeft"
                        angle={-90}
                        className="yAxisLabel"
                        />
                    </YAxis>
                    <Legend formatter={fixLegend} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={fixTooltip} labelFormatter={fixLabelTooltip} />
                    <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="2020" stroke="#8884d8" yAxisId={0} />
                    <Line type="monotone" dataKey="2019" stroke="#8dd1e1" yAxisId={0} />
                    <Line type="monotone" dataKey="2017_2019" stroke="#a4de6c" yAxisId={0} />
                    <Line type="monotone" dataKey="2015_2019" stroke="#ffc658" yAxisId={0} />
                    <ReferenceArea y1={1.75} y2={2.4} stroke="orange" strokeOpacity={0.3} label={<Label
                      value="Atividade alta"
                      className="grafico-text"
                      />} />
                    <ReferenceArea y1={2.41} y2={5} stroke="red" strokeOpacity={0.3} label={<Label
                      value="Atividade muito alta"
                      className="grafico-text"
                      />} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Text className="grafico-text">Fonte: InfoGripe da FioCruz. *SRAG (Síndrome Respiratória Aguda Grave)</Text>
            </section>
            <section className="section-grafico">
              <Title level={4}>Regiões do País: Incidência de hospitalizados por problemas respiratórios*</Title>
              <div className="parentGrid grafico-container">
                <div className="rodoabad">
                  <ResponsiveContainer aspect={getAspect()}>
                    <LineChart
                      width={600}
                      height={400}
                      className="grafico"
                      data={regioes}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <XAxis dataKey="epiweek_label" tick={fixTickX} height={50} tickSize={2} padding={{ top: 10 }} label={<Label
                        value="Semana do ano"
                        className="grafico-text"
                        />} />
                      <YAxis interval={0} type="number" tick={fixTickY} domain={[0, 'dataMax + 0.5']} ticks={yAxisRange}>
                        <Label
                          value={generateYAxisLabel()}
                          position="insideLeft"
                          angle={-90}
                          className="yAxisLabel"
                          />
                      </YAxis>
                      <Legend formatter={fixLegend} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={fixTooltip} labelFormatter={fixLabelTooltip} />
                      <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="Norte (2020)" stroke="#8884d8" yAxisId={0} />
                      <Line type="monotone" dataKey="Norte (2017_2019)" stroke="#a4de6c" yAxisId={0} />
                      <Line type="monotone" dataKey="Nordeste (2020)" stroke="#8884d8" yAxisId={0} />
                      <Line type="monotone" dataKey="Nordeste (2017_2019)" stroke="#a4de6c" yAxisId={0} />
                      <Line type="monotone" dataKey="Distrito Federal (2020)" stroke="#8884d8" yAxisId={0} />
                      <Line type="monotone" dataKey="Distrito Federal (2017_2019)" stroke="#a4de6c" yAxisId={0} />
                      <Line type="monotone" dataKey="Sudeste (2020)" stroke="#8884d8" yAxisId={0} />
                      <Line type="monotone" dataKey="Sudeste (2017_2019)" stroke="#a4de6c" yAxisId={0} />
                      <Line type="monotone" dataKey="Centro-Oeste (2020)" stroke="#8884d8" yAxisId={0} />
                      <Line type="monotone" dataKey="Centro-Oeste (2017_2019)" stroke="#a4de6c" yAxisId={0} />
                      <Line type="monotone" dataKey="Sul (2020)" stroke="#8884d8" yAxisId={0} />
                      <Line type="monotone" dataKey="Sul (2017_2019)" stroke="#a4de6c" yAxisId={0} />
                      <ReferenceArea y1={1.75} y2={2.4} stroke="orange" strokeOpacity={0.3} label={<Label
                          value="Atividade alta"
                          className="grafico-text"
                          />} />
                      <ReferenceArea y1={2.41} y2={5} stroke="red" strokeOpacity={0.3} label={<Label
                          value="Atividade muito alta"
                          className="grafico-text"
                          />} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Text className="grafico-text">Fonte: InfoGripe da FioCruz. *SRAG (Síndrome Respiratória Aguda Grave)</Text>
            </section>
          <Divider />
          <section className="metodologia">
            <Title level={4}>Metodologia</Title>
            <Paragraph>
              Os dados do InfoGripe da FioCruz consistem em dados de pessoas hospitalizadas por síndrome respiratória aguda grave (SRAG). Estes dados foram obtidos e divididos em 4, sendo eles:
            </Paragraph>
            <ol>
              <li>Dados de 2020.</li>
              <li>Dados de 2019.</li>
              <li>Média aritmética simples dos dados de 2017_2019.</li>
              <li>Média aritmética simples dos dados de 2015_2019.</li>
            </ol>
            <Paragraph>
             _partir dos dados, realizamos comparações por meio de gráficos onde é possível ver que o número de hospitalizados por problemas respiratórios cresceu muito, coincidentemente ou não, no mesmo período de início dos casos de covid-19 no Brasil.
            </Paragraph>
            <Paragraph>
              As áreas de limite são definidas baseadas no <a href="http://info.gripe.fiocruz.br/help">Help do Info Grip</a>
            </Paragraph>
            <Title level={4}>Limitações</Title>
            <Paragraph>
              Alguns dados mais recentes são reportados como "Dado estáveis. Sujeito_pequenas alterações", "Estimado. Sujeito_alterações" e "Dados incompletos. Sujetio_grandes alterações", dessa forma devemos entender que alguns dados, principalmente das semanas mais recentes poderão sofrer alterações, tanto para valores menores quanto para valores maiores. Mais informações sobre os dados ver o <a href="http://info.gripe.fiocruz.br/help">Help do Info Grip</a>.
            </Paragraph>
          </section>
          <Divider />
          <section className="fonte">
            <Title level={4}>Fonte</Title>
            <Paragraph><Text>
              FioCruz. Monitoramento de casos reportados de síndrome respiratória aguda grave (SRAG) hospitalizados. InfoGripe. Disponível em: {urlFonteInfoGripe}.
            </Text></Paragraph>
            <Paragraph><Text>
              Paulo Cesar. Coronavirus (COVID-19) Brazil Data. Disponível em: {urlFonteCovidBrasil}.
            </Text></Paragraph>
            <Paragraph><Text>
              Javier Aviles. CovidAPI - Coronavirus API for Current cases by country COVID-19. Disponível em: {urlFonteCovidMundo}.
            </Text></Paragraph>
          </section>
          <Divider />
          <section className="contribuir">
            <Title level={4}>Quer Contribuir com o projeto?</Title>
            <Paragraph>
              Faça um fork do projeto, realize o <em>download</em> do projeto no <a href="https://github.com/ArthurAssuncao/covid-internacoes">Github do Covid-Internações</a>, adicione códigos e submeta um <em>pull request</em>.
            </Paragraph>
            <Paragraph>
              Para executar o projeto, basta seguir o Readme.
            </Paragraph>
          </section>
          <Divider />
          <section className="contribuidores">
            <Title level={4}>Contribuidores</Title>
            <Tag><a href="https://github.com/ljnferreira">Lucas Ferreira</a></Tag>
          </section>
          {/*<Divider />*/}
        </Content>

        <Footer className="footer">Covid Internações ©2020 Criado por <a href='http://arthurassuncao.com'>Arthur Assunção</a></Footer>
      </Layout>
    </div>
  );
}

export default withGetScreen(App);
