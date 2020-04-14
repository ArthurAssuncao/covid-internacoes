
import json
import os
import requests
import time
import re

anos = [2015, 2016, 2017, 2018, 2019, 2020]
max_semanas = 52
url_base = 'http://info.gripe.fiocruz.br/data/detailed/1/1/{}/{}/1/Brasil/data-table'

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

def generate_base_ano_brasil(ano_base):
    anos = [ano_base]
    new_data = []
    
    for ano in anos:
        for semana in range(1, max_semanas):
            file_path = 'bases_json/base_{}_{}.json'.format(ano, semana)
            if os.path.exists(file_path):
                with open(file_path) as arq:
                    json_data = json.loads(arq.read())['semana']
                    for data in json_data:
                        if data['territory_name'] == 'Brasil':
                            del data['situation_name']
                            del data['territory_name']
                            data['value'] = float(re.findall(r"([0-9]{1,2}\.[0-9]{2,3})", data['value'])[0])
                            new_data.append(data)
    return new_data

def generate_base_ano_brasil_media(anos_base):
    data_completa = []
    new_data = []
    for ano in anos_base:
        data_completa.append(generate_base_ano_brasil(ano))
    for semana in range(1, max_semanas):
        try:
            new_value = 0
            indice = semana - 1
            for data in data_completa:
                if data[indice]['epiweek'] == semana:
                    new_value = new_value + data[indice]['value']
            new_data.append({
                'epiweek': semana,
                'value': new_value / len(anos_base)
            })
        except:
            pass

    return new_data

def generate_semana_label(semana):
    import datetime
    d = '2020-W{}'.format(semana-1)
    r = datetime.datetime.strptime(d + '-1', "%Y-W%W-%w")
    return r.strftime('%d-%b')

def convertToRecharts(jsonObj):
    new_data = []
    for semana in range(1, max_semanas):
        indice = semana - 1
        values = {}
        try:
            for key in jsonObj.keys():
                values['{}'.format(key)] = jsonObj[key][indice]['value']
            new_semana = {
                'epiweek': semana,
                'epiweek_label': generate_semana_label(semana)
            }
            new_semana.update(values)
            new_data.append(new_semana)
        except:
            pass
    return new_data

# gera 4 jsons
# - dados de 2020
# - dados de 2019
# - dados com a média de 2017 a 2019
# - dados com a média de 2015 a 2019
def generate_new_base():
    ano_base = 2020
    brasil_data_2020 = generate_base_ano_brasil(ano_base);

    ano_base = 2019
    brasil_data_2019 = generate_base_ano_brasil(ano_base);

    ano_base = [2017, 2018, 2019]
    brasil_data_2017_2019 = generate_base_ano_brasil_media(ano_base);

    ano_base = [2015, 2016, 2017, 2018, 2019]
    brasil_data_2015_2019 = generate_base_ano_brasil_media(ano_base);
    
    jsonObj = {
        '2020': brasil_data_2020,
        '2019': brasil_data_2019,
        '2017_2019': brasil_data_2017_2019,
        '2015_2019': brasil_data_2015_2019
    }
    jsonObj = {
        "brasil": convertToRecharts(jsonObj)
    }
    save_file(jsonObj, 'bd/brasil.json')


generate_new_base()