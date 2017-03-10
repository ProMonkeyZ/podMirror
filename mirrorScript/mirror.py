#!/usr/bin/python
#-*- coding: utf-8 -*-
#encoding=utf-8

import os
import os.path
import string,re,sys
import shutil
import cloneMirror
import urllib2
from urllib2 import urlopen
from pprint import pprint
import json

basepath=os.path.dirname(os.path.abspath(__file__))
json_data_dir = basepath+"/podInfo.json"

class JSONObject:
    def __init__(self, d):
        self.__dict__ = d

def podDataRequest():
    
    req = urllib2.Request("http://127.0.0.1:8080/api?m=pod_list&sid=1&callback=callme")
    res_data = urllib2.urlopen(req)
    response = res_data.read()
    pat = re.compile(r'^\w+\((.*)\);$',re.I)
    dataArr = pat.findall(response)
    jsonData = json.loads(dataArr[0]) 
    podArray = jsonData['data']
    for podData in podArray:
        poddumps = json.dumps(podData)
        podInfo = json.loads(poddumps, object_hook=JSONObject)
        cloneMirror.podCloneAndMirror(podInfo)


def podDataJson():
    f = open(json_data_dir,'r+')
    content = f.read()
    f.close()
    jsonData = json.loads(content)
    podArray = jsonData['data']
    for podData in podArray:
        poddumps = json.dumps(podData)
        podInfo = json.loads(poddumps, object_hook=JSONObject)
        cloneMirror.podCloneAndMirror(podInfo)

if __name__ == '__main__':
    podDataJson()