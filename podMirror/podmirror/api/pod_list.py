# -*- coding: utf-8 -*-

__all__ = [ 'op_name', 'process' ]

op_name = 'pod_list'


from api_exception import APIError
from podmirror import model
from podmirror.model import DBSession

def process(sid, params):
    podModels = DBSession.query(model.podModel).all()
    #podspecs = DBSession.query(model.podspec).filter_by(pid=55).all()
    return (podModels, 'success.')
