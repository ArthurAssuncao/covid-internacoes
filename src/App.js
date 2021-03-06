import React, { useState, useEffect } from 'react';
import './App.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea, Label, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { Helmet } from 'react-helmet';
import { Layout, PageHeader, Divider, Typography, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVirus } from '@fortawesome/free-solid-svg-icons';
import {withGetScreen} from 'react-getscreen';
import { Buffer } from 'buffer';
import ReactGA from 'react-ga';
import logo from './virus-icon.png';

import ContentStatistics from './ContentStatistics';

const { Text, Title, Paragraph } = Typography;
const { Header, Footer, Content } = Layout;

ReactGA.initialize('UA-163325072-1');

const COLORS = [
  '#8884d8',
  '#8dd1e1',
  '#a4de6c',
  '#ffc658',
  "#d1cd70",
  "#5ab89e",
  "#26a0a7",
  "#a2da91",
  "#dfb054",
  "#ec983d",
  "#e7a145",
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC'
]

const App = (props) => {
  const [brasil, setBrasil] = useState([]);
  const [brasilTotal, setBrasilTotal] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [semanaAtual, setSemanaAtual] = useState("a semana atual");
  const urlFonteInfoGripe = "<http://info.gripe.fiocruz.br/>";
  const urlFonteCovidBrasil = "<https://apify.com/pocesar/covid-brazil>";
  const urlFonteCovidMundo = "<https://github.com/javieraviles/covidAPI>";
  const urlFontePopulacao = "<https://countrymeters.info/pt/Brazil>";
  const contactEmail = Buffer.from('Y29udGF0b1thdF1hcnRodXJhc3N1bmNhby5jb20=', 'base64').toString('utf-8');

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    const urlApiBrasil = 'https://covid-internacoes.firebaseio.com/brasil.json';
    // urlApiBrasil = 'http://localhost:8000/brasil.json';
    fetch(urlApiBrasil).then(res => res.json()).then(data => {
      // data = data['brasil'];
      // console.log('Brasil: ', data);
      setBrasil(data);
      let diaAtual = data[data.length-1]['epiweek_label'];
      const regex = new RegExp("_(.*)", "g");
      diaAtual = regex.exec(diaAtual)[1]
      setSemanaAtual(diaAtual.replace("-", " de "));
    }).catch(function() {
        console.error("error");
    });
    const urlApiBrasilTotal = 'https://covid-internacoes.firebaseio.com/brasil_total.json';
    fetch(urlApiBrasilTotal).then(res => res.json()).then(data => {
      setBrasilTotal(data);
    }).catch(function() {
        console.error("error");
    });
    const urlApiRegioes = 'https://covid-internacoes.firebaseio.com/regioes.json';
    fetch(urlApiRegioes).then(res => res.json()).then(data => {
      // console.log('Regioes: ', data);
      setRegioes(data);
    }).catch(function() {
        console.error("error");
    });
  }, []);

  const CustomBarLabel = ({ payload, x, y, value, barWidth }) => {
    value = value / 1000;
    value = value.toFixed(0);
    value = '≈' + value + ' mil casos';
    return(
      <text x={x+10} y={y} fill="#777" dy={-6} className="grafico-text label-bar">
        {value}
      </text>
    );
  }

  const getAspect = () => {
    if (props.isMobile()){
      return 1;
    }
    return 1.6;
  }

  const getIntervalX = () => {
    if (props.isMobile()){
      return 'preserveEnd';
    }
    return 0;
  }

  const generateRangeY = (start, end, step) => {
      if (props.isMobile()){
        step = step * 2;
      }
      const labels = [];
      const y = start - end > 0 ? start - end : end - start;
      for (let i=start; i <= y; i += step) {
        labels.push(i);
      }
      return labels;
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
    const [dateStart, dateEnd] = payload.value.split('_')

    return (
      <g transform={`translate(${x},${y}), rotate(-30)`}>
        <text
          x={0}
          y={0}
          dx={10}
          dy={13}
          textAnchor="end"
          fill="#666"
          className="grafico-text"
        >
          <tspan x="0" dy="1.2em">{dateStart} a</tspan>
          <tspan x="0" dy="1.2em">{dateEnd}</tspan>
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

  const fixTooltip = (value, name) => {
    name = name.replace('_', ' a ');
    value = value.toFixed(2);
    return [value, name];
  }

  const fixTooltipInt = (value, name) => {
    name = name.replace('_', ' a ');
    value = value / 1000;
    value = value.toFixed(0);
    value = '≈' + value + ' mil';
    return [value, name];
  }

  const maxValue = 7
  const fixLabelTooltip = (value) => value.replace('_', ' a ');
  const intervalX = getIntervalX();
  const yAxisRange = generateRangeY(0, maxValue, 0.5);
  const yAxisRangeBar = generateRangeY(0, 60000, 5000);
  const chartHeight = 50;

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
                    <XAxis dataKey="epiweek_label" tick={fixTickX} height={chartHeight} tickSize={2} interval={intervalX} />
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
                    <ReferenceArea y1={1.75} y2={2.4} stroke="#DC3912" strokeOpacity={0.3} label={<Label
                      value="Atividade alta"
                      className="grafico-text"
                      />} />
                    <ReferenceArea y1={2.41} y2={5} stroke="red" strokeOpacity={0.3} label={<Label
                      value="Atividade muito alta"
                      className="grafico-text"
                      />} />
                    <ReferenceArea y1={5} y2={maxValue} stroke="red" strokeOpacity={0.3} label={<Label
                          value="Atividade altíssima"
                          className="grafico-text"
                          />} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Text className="grafico-text">Fonte: InfoGripe da FioCruz. *SRAG (Síndrome Respiratória Aguda Grave)</Text>
            </section>
            <section>
              <Title level={4}>Brasil: Internações totais por problemas respiratórios* até {semanaAtual}</Title>
              <div className="parentGrid grafico-container">
                <div className="rodoabad">
                  <ResponsiveContainer aspect={getAspect()}>
                    <BarChart width={730} height={250} data={brasilTotal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis interval={0} type="number" tick={fixTickY} ticks={yAxisRangeBar}>
                        <Label
                          value="Quantidade aproximada"
                          position="insideLeft"
                          angle={-90}
                          className="yAxisLabel"
                          />
                      </YAxis>
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={fixTooltipInt} labelFormatter={fixLabelTooltip} />
                      <Legend formatter={fixLegend} />
                      <Bar dataKey="2020" fill={COLORS[0]} label={<CustomBarLabel />} />
                      <Bar dataKey="2019" fill={COLORS[1]} label={<CustomBarLabel />} />
                      <Bar dataKey="2017_2019" fill={COLORS[2]} label={<CustomBarLabel />} />
                      <Bar dataKey="2015_2019" fill={COLORS[3]} label={<CustomBarLabel />} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
               </div>
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
                      <XAxis type="category" dataKey="epiweek_label" tick={fixTickX} height={chartHeight} tickSize={2} interval={intervalX} />
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
                      <Line type="monotone" dataKey="Norte (2020)" legendType='circle' dot={{ fill: COLORS[0], strokeWidth: 2 }} stroke={COLORS[0]} yAxisId={0} />
                      <Line type="monotone" dataKey="Norte (2017_2019)" stroke={COLORS[1]} yAxisId={0} />
                      <Line type="monotone" dataKey="Nordeste (2020)" legendType='circle' dot={{ fill: COLORS[2], strokeWidth: 2 }} stroke={COLORS[2]} yAxisId={0} />
                      <Line type="monotone" dataKey="Nordeste (2017_2019)" stroke={COLORS[3]} yAxisId={0} />
                      <Line type="monotone" dataKey="Distrito Federal (2020)" legendType='circle' dot={{ fill: COLORS[4], strokeWidth: 2 }} stroke={COLORS[4]} yAxisId={0} />
                      <Line type="monotone" dataKey="Distrito Federal (2017_2019)" stroke={COLORS[5]} yAxisId={0} />
                      <Line type="monotone" dataKey="Sudeste (2020)" legendType='circle' dot={{ fill: COLORS[6], strokeWidth: 2 }} stroke={COLORS[6]} yAxisId={0} />
                      <Line type="monotone" dataKey="Sudeste (2017_2019)" stroke={COLORS[7]} yAxisId={0} />
                      <Line type="monotone" dataKey="Centro-Oeste (2020)" legendType='circle' dot={{ fill: COLORS[8], strokeWidth: 2 }} stroke={COLORS[8]} yAxisId={0} />
                      <Line type="monotone" dataKey="Centro-Oeste (2017_2019)" stroke={COLORS[9]} yAxisId={0} />
                      <Line type="monotone" dataKey="Sul (2020)" legendType='circle' dot={{ fill: 'gray', strokeWidth: 2 }} stroke={COLORS[10]} yAxisId={0} />
                      <Line type="monotone" dataKey="Sul (2017_2019)" stroke={COLORS[11]} yAxisId={0} />
                      <ReferenceArea y1={1.75} y2={2.4} stroke="#DC3912" strokeOpacity={0.3} label={<Label
                          value="Atividade alta"
                          className="grafico-text"
                          />} />
                      <ReferenceArea y1={2.41} y2={5} stroke="red" strokeOpacity={0.3} label={<Label
                          value="Atividade muito alta"
                          className="grafico-text"
                          />} />
                      <ReferenceArea y1={5} y2={maxValue} stroke="red" strokeOpacity={0.3} label={<Label
                          value="Atividade altíssima"
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
              <li>Média aritmética simples dos dados de 2017 a 2019.</li>
              <li>Média aritmética simples dos dados de 2015 a 2019.</li>
            </ol>
            <Paragraph>
             A partir dos dados, realizamos comparações por meio de gráficos onde é possível ver que o número de hospitalizados por problemas respiratórios cresceu muito, coincidentemente ou não, no mesmo período de início dos casos de covid-19 no Brasil.
            </Paragraph>
            <Paragraph>
              As áreas de limite são definidas baseadas no <a href="http://info.gripe.fiocruz.br/help">Help do Info Grip</a>
            </Paragraph>
            <Paragraph>
              O gráfico de barras contém o cálculo do valor por 100 mil habitantes multiplicado pela quantidade de habitantes (em 100 mil) do país em determinado ano.
            </Paragraph>
            <Title level={4}>Limitações</Title>
            <Paragraph>
              Alguns dados mais recentes são reportados como "Dado estáveis. Sujeito à pequenas alterações", "Estimado. Sujeito à alterações" e "Dados incompletos. Sujetio à grandes alterações", dessa forma devemos entender que alguns dados, principalmente das semanas mais recentes poderão sofrer alterações, tanto para valores menores quanto para valores maiores. Mais informações sobre os dados ver o <a href="http://info.gripe.fiocruz.br/help">Help do Info Grip</a>.
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
            <Paragraph><Text>
              CountryMeters. População do Brasil. Disponível em: {urlFontePopulacao}.
            </Text></Paragraph>
          </section>
          <Divider />
          <section className="contribuir">
            <Title level={4}>Quer Contribuir com o projeto?</Title>
            <Paragraph>
              Envie e-mail para {contactEmail} ou...
            </Paragraph>
            <Paragraph>
              Faça um <em>fork (cópia)</em> do projeto, realize o <em>download</em> do projeto no <a href="https://github.com/ArthurAssuncao/covid-internacoes">Github do Covid-Internações</a>, adicione códigos e submeta um <em>pull request</em>.
            </Paragraph>
            <Paragraph>
              Para executar o projeto, basta seguir o Readme.
            </Paragraph>
          </section>
          <Divider />
          <section className="noticias">
            <Title level={4}>Notícias Relacionadas</Title>
            <Paragraph><a href="https://g1.globo.com/bemestar/coronavirus/noticia/2020/04/23/estudo-mostra-aumento-expressivo-de-internacoes-por-sindromes-respiratorias-e-indica-subnotificacao-da-covid-19.ghtml">Estudo mostra aumento expressivo de internações por síndromes respiratórias e indica subnotificação da Covid-19</a><span className="news-date">23/04/2020</span></Paragraph>
          </section>
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
