import os,sys

def getNewFileName(oldFileName):
    '根据旧的文件名生成新的文件名'
    if(not isDir(oldFileName)):
        return oldFileName[8:]
    return oldFileName

def getFileNameAndExName(fileName):
    '''获取文件名和文件的扩展名，
		返回一个二元组'''
    dotPos=fileName.rfind('.')
    if dotPos>=0:
        return(fileName[0:dotPos],fileName[dotPos+1:])
    return (fileName,None)

def isDir(fileName):
    return os.path.isdir(fileName)

#sys.exit(0)
#start

curScriptName=sys.argv[0].replace("\\","/").split("/")[-1];

oldFileNames=os.listdir()
oldFileNames.remove(curScriptName)
newFileNames=[]

print("重新命名如下：\n")

for fileName in oldFileNames:
    newFileNames.append(getNewFileName(fileName))
    if fileName!=newFileNames[-1]:
        print("{0} -> {1}".format(fileName,newFileNames[-1]))

print()

while True:
    print("是否确认执行上述命名？(y/n)")
    choose=input()
    if choose=='y':
        for i in range(0,len(oldFileNames)):
            os.rename(oldFileNames[i],newFileNames[i])
        print("重命名完毕。")
        break
    elif choose=='n':
        print("重命名取消。")
        break
    else:
        print("请输入y/n.")
