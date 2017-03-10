# -*- coding: utf-8 -*-

__all__ = [ 'op_name', 'process' ]

op_name = 'pod_delete'


from api_exception import APIError
from podmirror import model
from podmirror.model import DBSession

def process(sid, params):

    #删除pod
    pod = DBSession.query(model.podModel).filter_by(pid=params['pid']).first()
    if not pod:
        return dict(errors={'pod':'pod not found'})
    DBSession.delete(pod)

    #podspecs = DBSession.query(model.podspec).filter_by(pid=55).all()
    return ({}, 'success.')