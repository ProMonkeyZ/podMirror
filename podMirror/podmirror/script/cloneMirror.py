#!/usr/bin/python
#-*- coding: utf-8 -*-
#encoding=utf-8

import os
import os.path
import string,re,sys
import shutil
import podspecSearch

basepath=os.path.dirname(os.path.abspath(__file__))
orgin_dir = basepath+"/repos"
clone_sh_dir = basepath+"/clone.sh"
push_sh_dir = basepath+"/update_push_mirror.sh"

#clone源码库
def podClone(podInfo):
    #如果为0则需要镜像源代码仓库
    if podInfo.noReplaceSource == 0:
        shell = clone_sh_dir + ' ' + podInfo.sourceHttpUrl + ' ' + podInfo.podName + ' ' + orgin_dir
        output = os.system(shell)
        pullRemove(podInfo)
        pushMirror(podInfo)
    podspecSearch.copyPodspec(podInfo)

#删除pull request
def pullRemove(podInfo):
    pod_dir = os.path.join(orgin_dir,podInfo.podName)
    for parent, dirnames, filenames in os.walk(pod_dir):
        for filename in filenames:
            if filename == "config":
                f = open(parent + "/" + filename,'r+')
                content = f.read()
                f.close()
                if content.find("fetch = +refs/*:refs/*")>-1:
                    replaceContent = content.replace("fetch = +refs/*:refs/*","fetch = +refs/heads/*:refs/heads/*\n\tfetch = +refs/tags/*:refs/tags/*")
                    fw = open(parent + "/" + filename,'r+')
                    fw.write(replaceContent)
                    fw.close()
            elif filename == "packed-refs":
                with open(parent + "/" + filename, 'r') as f:
                    with open(parent + "/" + filename + "new", 'w') as g:
                        for line in f.readlines():
                            if 'refs/pull/' not in line:
                                g.write(line)
                shutil.move(parent + "/" + filename + "new", parent + "/" + filename)

def pushMirror(podInfo):
    shell = push_sh_dir + ' ' + os.path.join(orgin_dir,podInfo.podName) + ' ' + podInfo.mirrorSSHUrl
    output = os.system(shell)

def podCloneAndMirror(podInfo):
    podClone(podInfo)
