# -*- coding: utf-8 -*-

__all__ = [ 'op_name', 'process' ]

op_name = 'start_schedule'


from api_exception import APIError
from podmirror import model
from podmirror.model import DBSession
from threading import Timer
from multiprocessing import Pool
import pod_mirror_all

def printHello():
    print "开始全部镜像"
    pod_mirror_all.process(1,{})
    t = Timer(3600, printHello)
    t.start()

def process(sid, params):
    
    global start

    if params.has_key('start'):
        start = int(params['start'])
        if start == 1:
            printHello()

    #podspecs = DBSession.query(model.podspec).filter_by(pid=55).all()
    return (start, 'success.')
