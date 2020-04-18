
import json
import os
import requests
import time
import re

anos = [2015, 2016, 2017, 2018, 2019, 2020]
max_semanas = 52
url_base = 'http://info.gripe.fiocruz.br/data/detailed/1/1/{}/{}/1/Brasil/data-table'
estados = {
  'Acre': 'AC',
  'Alagoas': 'AL',
  'Amapá': 'AP',
  'Amazonas': 'AM',
  'Bahia': 'BA',
  'Ceará': 'CE',
  'Distrito Federal': 'DF',
  'Espírito Santo': 'ES',
  'Goiás': 'GO',
  'Maranhão': 'MA',
  'Mato Grosso': 'MT',
  'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG',
  'Paraná': 'PR',
  'Paraíba': 'PB',
  'Pará': 'PA',
  'Pernambuco': 'PE',
  'Piauí': 'PI',
  'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS',
  'Rio de Janeiro': 'RJ',
  'Rondônia': 'RO',
  'Roraima': 'RR',
  'Santa Catarina': 'SC',
  'Sergipe': 'SE',
  'São Paulo': 'SP',
  'Tocantins': 'TO'
}

regioes_estados = {
  'Norte': {
    'Acre': estados['Acre'],
    'Amapá': estados['Amapá'],
    'Amazonas': estados['Amazonas'],
    'Pará': estados['Pará'],
    'Rondônia': estados['Rondônia'],
    'Roraima': estados['Roraima'],
    'Tocantins': estados['Tocantins']
  },
  'Nordeste': {
    'Alagoas': estados['Alagoas'],
    'Bahia': estados['Bahia'],
    'Ceará': estados['Ceará'],
    'Maranhão': estados['Maranhão'],
    'Paraíba': estados['Paraíba'],
    'Pernambuco': estados['Pernambuco'],
    'Piauí': estados['Piauí'],
    'Rio Grande do Norte': estados['Rio Grande do Norte'],
    'Sergipe': estados['Sergipe']
  },
  'Centro-Oeste': {
    'Goiás': estados['Goiás'],
    'Mato Grosso': estados['Mato Grosso'],
    'Mato Grosso do Sul': estados['Mato Grosso do Sul']
  },
  'Sudeste': {
    'Espírito Santo': estados['Espírito Santo'],
    'Minas Gerais': estados['Minas Gerais'],
    'Rio de Janeiro': estados['Rio de Janeiro'],
    'São Paulo': estados['São Paulo']
  },
  'Sul': {
    'Paraná': estados['Paraná'],
    'Rio Grande do Sul': estados['Rio Grande do Sul'],
    'Santa Catarina': estados['Santa Catarina']
  },
  'Distrito Federal': {
    'Distrito Federal': estados['Distrito Federal']
  }
}

estados_regiao = {
  'Distrito Federal': 'Distrito Federal',
  'Paraná': 'Sul',
  'Rio Grande do Sul': 'Sul',
  'Santa Catarina': 'Sul',
  'Espírito Santo': 'Sudeste',
  'Minas Gerais': 'Sudeste',
  'Rio de Janeiro': 'Sudeste',
  'São Paulo': 'Sudeste',
  'Goiás': 'Centro-Oeste',
  'Mato Grosso': 'Centro-Oeste',
  'Mato Grosso do Sul': 'Centro-Oeste',
  'Alagoas': 'Nordeste',
  'Bahia': 'Nordeste',
  'Ceará': 'Nordeste',
  'Maranhão': 'Nordeste',
  'Paraíba': 'Nordeste',
  'Pernambuco': 'Nordeste',
  'Piauí': 'Nordeste',
  'Rio Grande do Norte': 'Nordeste',
  'Sergipe': 'Nordeste',
  'Acre': 'Norte',
  'Amapá': 'Norte',
  'Amazonas': 'Norte',
  'Pará': 'Norte',
  'Rondônia': 'Norte',
  'Roraima': 'Norte',
  'Tocantins': 'Norte'
}

lista_estados = estados.keys()


headers_default = {
  'Accept': 'application/json,text/*;q=0.99',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1'
}

def download_save_all_json():
  for ano in anos:
    for semana in range(1, max_semanas):
      success, newJson = download_json(ano, semana)
      if success:
        file_path = 'bases_json/base_{}_{}.json'.format(ano, semana)
        save_file(newJson, file_path)

def download_json(ano, semana):
  url = url_base.format(ano, semana)
  print(url)
  r = requests.get(url, headers=headers_default)
  success = False
  newJson = {'semana': []}
  try:
    jsonObj = r.json()
    # print(json)
    newJson['semana'] = jsonObj['data']
    success = True
  except:
    pass
  return success, newJson

def save_file(jsonObj, file_path):
  with open (file_path, 'w', encoding='utf8') as arq:
    data = json.dumps(jsonObj, ensure_ascii=False)
    arq.write(data)

def generate_base_ano(ano_base, estado):
  anos = [ano_base]
  new_data = []

  for ano in anos:
    for semana in range(1, max_semanas):
      file_path = 'bases_json/base_{}_{}.json'.format(ano, semana)
      if os.path.exists(file_path):
        with open(file_path) as arq:
          json_data = json.loads(arq.read())['semana']
          for data in json_data:
            if data['territory_name'].lower() == estado.lower():
              del data['situation_name']
              if estado.lower() == 'Brasil'.lower():
                del data['territory_name']
              else:
                pass
                # try:
                #   data['valuePerc'] = float(re.findall(r"([0-9]{1,2}\.[0-9]{1,2}) %", data['value'])[0])
                # except:
                #   data['valuePerc'] = float('0.0')
              data['value'] = float(re.findall(r"([0-9]{1,2}\.[0-9]{2,3})", data['value'])[0])
              new_data.append(data)
  return new_data

def generate_base_ano_media(anos_base, estado):
  data_completa = []
  new_data = []
  for ano in anos_base:
    data_completa.append(generate_base_ano(ano, estado))
  for semana in range(1, max_semanas):
    try:
      new_value = 0
      new_value_perc = 0
      indice = semana - 1
      for data in data_completa:
        if data[indice]['epiweek'] == semana:
          new_value = new_value + data[indice]['value']
          if 'valuePerc' in data[indice]:
            new_value_perc = new_value_perc + data[indice]['valuePerc']
      estado_data = {
        'epiweek': semana,
        'value': new_value / len(anos_base)
      }
      if estado.lower() != 'Brasil'.lower():
        try:
          estado_data['valuePerc'] = new_value_perc / len(anos_base)
        except:
          estado_data['valuePerc'] = 0
      new_data.append(estado_data)
    except :
      pass

  return new_data

def generate_semana_label(semana):
  import datetime
  d = '2020-W{}'.format(semana-1)
  r1 = datetime.datetime.strptime(d + '-1', "%Y-W%W-%w")
  r2 = datetime.datetime.strptime(d + '-0', "%Y-W%W-%w")
  semana_label = '{}_{}'.format(r1.strftime('%d-%b'), r2.strftime('%d-%b'))
  return semana_label

def generate_semana_recharts(jsonObj, indice, semana):
  values = {}
  try:
    for ano in jsonObj.keys():
      values['{}'.format(ano)] = jsonObj[ano][indice]['value']
    new_semana = {
      'epiweek': semana,
      'epiweek_label': generate_semana_label(semana)
    }
    new_semana.update(values)
    return new_semana
  except IndexError as e:
    raise e

def generate_semana_recharts_estados(jsonObj, indice, semana, estado):
  values = {}
  try:
    for ano in jsonObj.keys():
      values['{}'.format(ano)] = jsonObj[ano][estado][indice]['value']
      # if 'valuePerc' in jsonObj[ano][estado][indice]:
      #   values['{} (%)'.format(ano)] = jsonObj[ano][estado][indice]['valuePerc']
    new_semana = {
      'epiweek': semana,
      'territory_abbreviation': estados[estado],
      'epiweek_label': generate_semana_label(semana)
    }
    new_semana.update(values)
    return new_semana
  except IndexError as e:
    raise e

def convert_to_recharts_brasil(jsonObj):
  new_data = []
  for semana in range(1, max_semanas):
    indice = semana - 1
    # pega apenas o minimo de semanas de acordo com o ultimo ano
    # pois gera erro caso_semana não exista em algum ano
    try:
      new_semana = generate_semana_recharts(jsonObj, indice, semana)
      new_data.append(new_semana)
    except IndexError as e:
      pass
  return new_data

def convert_to_recharts_estados(jsonObj):
  new_data = {}
  for semana in range(1, max_semanas):
    indice = semana - 1
    # pega apenas o minimo de semanas de acordo com o ultimo ano
    # pois gera erro caso_semana não exista em algum ano
    try:
      for estado in lista_estados:
        if estado not in new_data:
          new_data[estado] = []
        new_semana_estado = generate_semana_recharts_estados(jsonObj, indice, semana, estado)
        new_data[estado].append(new_semana_estado)
    except Exception as e:
      pass
  return new_data

# gera 4 jsons
# - dados de 2020
# - dados de 2019
# - dados com_média de 2017_2019
# - dados com_média de 2015_2019
def generate_new_base_brasil():
  estado = 'Brasil'
  ano_base = 2020
  brasil_data_2020 = generate_base_ano(ano_base, estado)

  ano_base = 2019
  brasil_data_2019 = generate_base_ano(ano_base, estado)

  ano_base = [2017, 2018, 2019]
  brasil_data_2017_2019 = generate_base_ano_media(ano_base, estado)

  ano_base = [2015, 2016, 2017, 2018, 2019]
  brasil_data_2015_2019 = generate_base_ano_media(ano_base, estado)

  jsonObj = {
    '2020': brasil_data_2020,
    '2019': brasil_data_2019,
    '2017_2019': brasil_data_2017_2019,
    '2015_2019': brasil_data_2015_2019
  }
  jsonObj = {
    "brasil": convert_to_recharts_brasil(jsonObj)
  }
  return jsonObj

def generate_new_base_estados():
  ano_base = 2020
  estados_data_2020 = {}
  for estado in lista_estados:
    estado_data = generate_base_ano(ano_base, estado)
    estados_data_2020[estado] = estado_data

  ano_base = 2019
  estados_data_2019 = {}
  for estado in lista_estados:
    estado_data = generate_base_ano(ano_base, estado)
    estados_data_2019[estado] = estado_data

  ano_base = [2017, 2018, 2019]
  estados_data_2017_2019 = {}
  for estado in lista_estados:
    estado_data = generate_base_ano_media(ano_base, estado)
    estados_data_2017_2019[estado] = estado_data

  ano_base = [2015, 2016, 2017, 2018, 2019]
  estados_data_2015_2019 = {}
  for estado in lista_estados:
    estado_data = generate_base_ano_media(ano_base, estado)
    estados_data_2015_2019[estado] = estado_data

  jsonObj = {
    '2020': estados_data_2020,
    '2019': estados_data_2019,
    '2017_2019': estados_data_2017_2019,
    '2015_2019': estados_data_2015_2019
  }
  jsonObj = {
    "estados": convert_to_recharts_estados(jsonObj)
  }
  return jsonObj

def generate_new_base_regioes1(jsonEstados):
  jsonObj = {}

  for regiao in regioes_estados.keys():
    # year_keys = ['2020', '2020 (%)', '2019', '2019 (%)', '2017_2019', '2017_2019 (%)', '2015_2019', '2015_2019 (%)']
    year_keys = ['2020', '2019', '2017_2019', '2015_2019']
    for semana in range(1, max_semanas):
      indice = semana - 1
      try:
        if regiao not in jsonObj:
          jsonObj[regiao] = []
        new_data = None
        for estado in regioes_estados[regiao].keys():
          if not new_data:
            new_data = jsonEstados['estados'][estado][indice]
            new_data['region'] = regiao
            del new_data['territory_abbreviation']
          else:
            for year_key in year_keys:
              new_data[year_key] = new_data[year_key] + jsonEstados['estados'][estado][indice][year_key]

        for year_key in year_keys:
          new_data[year_key] = new_data[year_key] / len(regioes_estados[regiao].keys())
        jsonObj[regiao].append(new_data)
      except IndexError as e:
        pass

  return jsonObj

def generate_new_base_regioes(jsonEstados):
  jsonObj = []
  year_keys = ['2020', '2017_2019']
  for semana in range(1, max_semanas):
    indice = semana - 1
    semana_data = {}
    try:
      for estado in lista_estados:
        for year_key in year_keys:
          new_key = '{} ({})'.format(estados_regiao[estado], year_key)
          if new_key not in semana_data:
            semana_data['epiweek'] = jsonEstados['estados'][estado][indice]['epiweek']
            semana_data['epiweek_label'] = jsonEstados['estados'][estado][indice]['epiweek_label']
            semana_data[new_key] = jsonEstados['estados'][estado][indice][year_key]
          else:
            semana_data[new_key] = semana_data[new_key] + jsonEstados['estados'][estado][indice][year_key]
      for key in semana_data.keys():
        if '20' in key:
          regiao = re.findall(r"(.*) \(", key)[0]
          num_estados = len(regioes_estados[regiao].keys())
          semana_data[key] = semana_data[key] / num_estados
      jsonObj.append(semana_data)
    except IndexError as e:
      pass
  return {'regioes': jsonObj}

def update_firebase(bd_brasil, bd_regioes):
  import firebase_admin
  from firebase_admin import credentials
  from firebase_admin import db

  # Fetch the service account key JSON file contents
  cred = credentials.Certificate('firebase-adminsdk.json')
  # Initialize the app with a service account, granting admin privileges
  firebase_admin.initialize_app(cred, {
      'databaseURL': 'https://covid-internacoes.firebaseio.com/'
  })
  ref = db.reference('/')
  ref.set({
    'brasil': bd_brasil['brasil'],
    'regioes': bd_regioes['regioes'],
  })

# ano = 2020
# semana = 15
# success, newJson = download_json(ano, semana)
# if success:
#   file_path = 'bases_json/base_{}_{}.json'.format(ano, semana)
#   save_file(newJson, file_path)
bd_brasil = generate_new_base_brasil()
save_file(bd_brasil, 'bd/brasil.json')
bd_estados = generate_new_base_estados()
save_file(bd_estados, 'bd/estados.json')
bd_regioes = generate_new_base_regioes(bd_estados)
save_file(bd_regioes, 'bd/regioes.json')

update_firebase(bd_brasil, bd_regioes)
