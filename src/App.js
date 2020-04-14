import React, { useState, useEffect } from 'react';
import './App.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea, Label
} from 'recharts';
import { Helmet } from 'react-helmet';
import { Layout, PageHeader, Tabs, Divider, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVirus } from '@fortawesome/free-solid-svg-icons';
import logo from './virus-icon.png';

import ContentStatistics from './ContentStatistics';

const { Text, Title, Paragraph } = Typography;
const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;

const App = () => {
  const [brasil, setBrasil] = useState([]);
  const urlFonteInfoGripe = "<http://info.gripe.fiocruz.br/>";
  const urlFonteCovidBrasil = "<https://apify.com/pocesar/covid-brazil>";
  const urlFonteCovidMundo = "<https://github.com/javieraviles/covidAPI>";

  useEffect(() => {
    fetch('https://covid-internacoes.firebaseio.com/brasil.json').then(res => res.json()).then(data => {
      console.log(data);
      setBrasil(data); 
    });
  }, []);

  const generateRange = (start, end, step) => {
      const array = [];
      const y = start - end > 0 ? start - end : end - start;
      for (let i=start; i <= y; i += step) {
          array.push(i);
      }
      return array;
  }

  const yAxisRange = generateRange(0, 5.5, 0.5);

  return (
    <div className="App">
      <Helmet>
        <title>Covid-19 Internações</title>
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
              subTitle="Crescimento das internações hospitalares por problemas respiratórios"
              avatar={{ icon: <FontAwesomeIcon icon={faVirus} /> }}
              >
              <Divider />
              <ContentStatistics />
            </PageHeader>
          </div>
        </Header>
        <Content className="content">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Brasil" key="1">
              <Title level={4}>Incidência de hospitalizados por SRAG (Síndrome Respiratória Aguda Grave)</Title>
              <LineChart
                width={600}
                height={400}
                className="grafico"
                data={brasil}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis dataKey="epiweek_label" height={50} tick={{strokeWidth: 2}} tickSize={2} padding={{ top: 10 }} label="Semana do ano" />
                <YAxis interval={0} type="number" domain={[0, 'dataMax + 0.5']} ticks={yAxisRange}>
                  <Label
                    value="Incidência de SRAG (por 100 mil habitantes)"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: 'middle' }}
                    />
                </YAxis>
                <Legend />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="2020" stroke="#8884d8" yAxisId={0} />
                <Line type="monotone" dataKey="2019" stroke="#8dd1e1" yAxisId={0} />
                <Line type="monotone" dataKey="2017_2019" stroke="#a4de6c" yAxisId={0} />
                <Line type="monotone" dataKey="2015_2019" stroke="#ffc658" yAxisId={0} />
                <ReferenceArea y1={1.75} y2={2.4} stroke="orange" strokeOpacity={0.3} label="Atividade alta" />
                <ReferenceArea y1={2.41} y2={5} stroke="red" strokeOpacity={0.3} label="Atividade muito alta" />
              </LineChart>
              Fonte: InfoGripe da FioCruz.
            </TabPane>
            <TabPane tab="Estados" key="2">
              <Paragraph>
                Em construção.
              </Paragraph>
            </TabPane>
          </Tabs>
          <Divider />
          <section className="metodologia">
            <Title level={4}>Metodologia</Title>
            <Paragraph>
              Os dados do InfoGripe da FioCruz consistem em dados de pessoas hospitalizadas por síndrome respiratória aguda grave (SRAG). Estes dados foram obtidos e divididos em 4, sendo eles:
            </Paragraph>
            <ol>
              <li>Dados de 2020.</li>
              <li>Dados de 2019.</li>
              <li>Média aritmética simples dos dados de 2017 a 2019.</li>
              <li>Média aritmética simples dos dados de 2015 a 2019.</li>
            </ol>
            <Paragraph>
              A partir dos dados, realizamos comparações por meio de gráficos onde é possível ver que o número de hospitalizados por problemas respiratórios cresceu muito, coincidentemente ou não, no mesmo período de início dos casos de covid-19 no Brasil.
            </Paragraph>
            <Paragraph>
              As áreas de limite são definidas baseadas no <a href="http://info.gripe.fiocruz.br/help">Help do Info Grip</a>
            </Paragraph>
            <Title level={4}>Limitações</Title>
            <Paragraph>
              Alguns dados mais recentes são reportados como "Dado estáveis. Sujeito a pequenas alterações", "Estimado. Sujeito a alterações" e "Dados incompletos. Sujetio a grandes alterações", dessa forma devemos entender que alguns dados, principalmente das semanas mais recentes poderão sofrer alterações, tanto para valores menores quanto para valores maiores. Mais informações sobre os dados ver o <a href="http://info.gripe.fiocruz.br/help">Help do Info Grip</a>.
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
        </Content>

        <Footer className="footer">Covid Internações ©2020 Criado por <a href='http://arthurassuncao.com'>Arthur Assunção</a></Footer>
      </Layout>
    </div>
  );
}

export default App;
