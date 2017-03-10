from sqlalchemy import *
from sqlalchemy.orm import mapper, relation, relation, backref
from sqlalchemy import Table, ForeignKey, Column
from sqlalchemy.types import Integer, Unicode, DateTime

from podmirror.model import DeclarativeBase, metadata, DBSession
from datetime import datetime

class podModel(DeclarativeBase):
   __tablename__ = 'podModel'

   pid = Column(Integer, primary_key = True)
   podName = Column(Unicode(20), nullable = False, default = '')
   sourceHttpUrl = Column(Unicode(100), nullable = True, default = '')
   specSourceHttpUrl = Column(Unicode(100), nullable = True, default = '')
   mirrorSSHUrl = Column(Unicode(100), nullable = True, default = '')
   mirrorHttpUrl = Column(Unicode(100), nullable = True, default = '')
   noReplaceSource = Column(Unicode(20), nullable = False, default = 0)