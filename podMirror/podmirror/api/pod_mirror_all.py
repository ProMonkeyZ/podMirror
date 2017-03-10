# -*- coding: utf-8 -*-

__all__ = [ 'op_name', 'process' ]

op_name = 'pod_mirror_all'

from podmirror import model
from podmirror.model import DBSession
from podmirror.script import cloneMirror
from api_exception import APIError
import copy
import traceback

def process(sid, params):

    podModels = DBSession.query(model.podModel).all()
    for podInfo in podModels:
        #创建对应tag的二进制库
        pod = DBSession.query(model.podModel).filter_by(pid=podInfo.pid).first()
        try:
            cloneMirror.podCloneAndMirror(copy.deepcopy(pod))
        except Exception, e:
            status, message = e.args
            if status == 4:
                raise APIError(4,message)
            else:
                raise APIError(1,traceback.format_exc())

    #podspecs = DBSession.query(model.podspec).filter_by(pid=55).all()
    return ({}, 'success.')
