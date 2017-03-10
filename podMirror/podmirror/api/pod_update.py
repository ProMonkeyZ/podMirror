# -*- coding: utf-8 -*-

__all__ = [ 'op_name', 'process' ]

op_name = 'pod_update'


from api_exception import APIError
from podmirror import model
from podmirror.model import DBSession

def process(sid, params):
    print params['pid']
    pod = DBSession.query(model.podModel).get(params['pid'])
    if not pod:
        raise APIError(1,'pod is not existed')

    if params.has_key('podName'):
        pod.podName = params['podName']

    if params.has_key('sourceHttpUrl'):
        pod.sourceHttpUrl = params['sourceHttpUrl']

    if params.has_key('specSourceHttpUrl'):
        pod.specSourceHttpUrl = params['specSourceHttpUrl']

    if params.has_key('mirrorSSHUrl'):
        pod.mirrorSSHUrl = params['mirrorSSHUrl']

    if params.has_key('mirrorHttpUrl'):
        pod.mirrorHttpUrl = params['mirrorHttpUrl']

    if params.has_key('noReplaceSource'):
        pod.noReplaceSource = params['noReplaceSource']
        print "######" + params['noReplaceSource']

    #podspecs = DBSession.query(model.podspec).filter_by(pid=55).all()
    return (pod, 'success.')
