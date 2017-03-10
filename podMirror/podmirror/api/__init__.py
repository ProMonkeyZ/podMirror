# -*- coding: utf-8 -*-

from api_exception import APIError

def process_request(op_name, sid, params):
    result = {
        'info': 'success.',
        'data': {},
        'status': 0
    }

    try:
        op = op_dict[op_name]
    except KeyError as e:
        result['info'] = 'unknown api name [%s].' % e
        result['status'] = 2
        return result

    try:
        result['data'], result['info'] = op(sid, params)
    except APIError as e:
        result['info'] = e.info
        result['status'] = e.status
    except Exception as e:
        result['info'] = 'unknown server exception [%s].' % e
        result['status'] = 90
    return result

op_dict = {}
import inspect, sys

def load(mod):
    if '__all__' in mod.__dict__:
        names = mod.__all__
    else:
        names = dir(mod)
    if 'op_name' in names and 'process' in names:
        op_dict[mod.__dict__['op_name']] = mod.__dict__['process']

import pod_add
load(pod_add)

import pod_delete
load(pod_delete)

import pod_list
load(pod_list)

import pod_update
load(pod_update)

import pod_mirror
load(pod_mirror)

import pod_mirror_all
load(pod_mirror_all)

import start_schedule
load(start_schedule)