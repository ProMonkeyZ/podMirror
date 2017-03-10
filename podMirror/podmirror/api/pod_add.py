# -*- coding: utf-8 -*-

__all__ = [ 'op_name', 'process' ]

op_name = 'pod_add'


from api_exception import APIError
from podmirror import model
from podmirror.model import DBSession

def process(sid, params):
    podone = DBSession.query(model.podModel).filter_by(podName=params['podName']).first()
    if podone:
        raise APIError(1,'podName: '+params['podName'] + '已存在')

    newPod = model.podModel(podName = params['podName'],sourceHttpUrl = params['sourceHttpUrl'],specSourceHttpUrl = params['specSourceHttpUrl'],mirrorSSHUrl = params['mirrorSSHUrl'],mirrorHttpUrl = params['mirrorHttpUrl'],noReplaceSource = params['noReplaceSource'])
    
    DBSession.add(newPod)
    DBSession.flush()

    #podspecs = DBSession.query(model.podspec).filter_by(pid=55).all()
    return (newPod, 'success.')
