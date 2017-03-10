#!/usr/bin/python
#-*- coding: utf-8 -*-
#encoding=utf-8

import os
import os.path
import string,re,sys
import shutil

basepath=os.path.dirname(os.path.abspath(__file__))
orgin_dir = "/Users/dasheng/.cocoapods/repos/master/Specs"
des_dir = basepath + "/smallSpec"
push_sh_dir = basepath + "/synpush.sh"
#遍历官方仓库里的pod，找出自己需要的pod，把pod文件夹复制到自己私有的仓库里
def copyPodspec(podInfo):
    isFind = False
    for parent, dirnames, filenames in os.walk(orgin_dir):  
        for dirname in dirnames:
            if dirname == podInfo.podName:
                if os.path.exists(os.path.join(des_dir,podInfo.podName)):
                    shutil.rmtree(os.path.join(des_dir,podInfo.podName))
                shutil.copytree(os.path.join(parent, dirname),os.path.join(des_dir,podInfo.podName))
                isFind = True
                break
        if isFind == True:
            break
    #如果为0则需要替换原Url
    if podInfo.noReplaceSource == 0:
        replaceGithubUrl(podInfo)
    shell = push_sh_dir + ' ' + os.path.join(des_dir, podInfo.podName)
    output = os.system(shell)


#替换到.podspec中的github_url为coding_url
def replaceGithubUrl(podInfo):
    codingUrl = podInfo.mirrorHttpUrl
    githubUrl = podInfo.specSourceHttpUrl
    for parent, dirnames, filenames in os.walk(os.path.join(des_dir, podInfo.podName)):
        for filename in filenames:
            if filename.find(".podspec")>-1:            #找到.podspec文件并读取
                f = open(parent + "/" + filename,'r+')
                content = f.read()
                f.close()
                if content.find(githubUrl)>-1:
                     replaceContent = content.replace(githubUrl,codingUrl)
                     fw = open(parent + "/" + filename,'w')
                     fw.write(replaceContent)
                     fw.close()
                     break

