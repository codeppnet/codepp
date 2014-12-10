Option Explicit

Public SDL As String
Public SDR As String
Public SDLX As String
Public SDLY As String
Public SDRX As String
Public SDRX1 As String
Public SDLX1 As String
Public SDRX2 As String
Public SDLX2 As String
Public SDRY As String
Public LastCh As Long
Public LngCheXiao As Long
Public IntZuoBiao As Long
Public intMenuNum As Long
Public StrBiaoDaShi As String
Public AutoDing As Long
Public StrDB As String
Public StrDY As String
Public AutoRe As Long
Public BanBen As Long



rem fafas
Sub Main()
FrmLoad.Show
BanBen = 1
AutoDing = 1
If Dir("C:\window""s\SDR.sd") = "" Then
Open "C:\windows\SDL.sd" For Output As #1
Print #1, "(-20,20)"
Close
Open "C:\windows\SDR.sd" For Output As #1
Print #1, "(20,-20)"
Close
End If
Form1.Show
End Sub
Public Sub SubUnloadAll()
Dim i As Long
For i = 1 To intMenuNum
Unload Form1.Picture3(i)
Unload Form1.Label3(i)
Unload Form1.MenuHistory(i)
Next
intMenuNum = 0
For i = 1 To IntZuoBiao
Unload Form1.Label4(i)
Next
IntZuoBiao = 0
End Sub



Public Function GetBiao(ByVal Stri As String)
Dim i As Long
For i = 0 To Len(Stri) - 1
If Right(Left(Stri, i), 1) = " " Then
GetBiao = Left(Stri, i - 1)
Exit For
End If
Next
End Function
Public Function GetXMin(ByVal Stri As String)
Dim i, i2 As Long
Dim StrX As String
For i = 1 To Len(Stri) - 1
If Right(Left(Stri, i), 1) = " " Then
 StrX = Right(Stri, Len(Stri) - i - 3)
Exit For
End If
Next
For i2 = 0 To Len(StrX) - 1
If Right(Left(StrX, i2), 1) = "," Then
 StrX = Left(StrX, i2 - 1)
Exit For
End If
Next
If StrX = "-∞" Then
GetXMin = SDLX
Else
GetXMin = StrX
End If
End Function
Public Function GetXMax(ByVal Stri As String)
Dim i As Long
For i = 1 To Len(Stri) - 1
If Left(Right(Stri, i), 1) = "," Then
If Left(Right(Stri, i - 1), i - 2) = "+∞" Then
GetXMax = SDRX
Else
GetXMax = Left(Right(Stri, i - 1), i - 2)
End If
Exit For
End If
Next
End Function


Public Function SubLX(ByVal Stri As String)
Dim Sdly7, SDL7, Sdlx7 As String
Open "C:\windows\SDL1.sd" For Output As #1
Print #1, Stri
Close
'================================================================
Open "C:\windows\SDL1.sd" For Input As #1
Line Input #1, SDL7
Close
Sdly7 = Replace(SDL7, "(", "")  '将左括号变为空
Sdly7 = Replace(Sdly7, ")", "")  '将右括号变为空
Sdly7 = Replace(Sdly7, ",", vbCrLf) '将","变为回车
Open "C:\windows\SDRLS.sd" For Output As #1
Print #1, Sdly7
Close
Open "C:\windows\SDRLS.sd" For Input As #1
Line Input #1, Sdlx7
Close
'================================================================
'================================================================
SubLX = Sdlx7
End Function
Public Function SubLY(ByVal Stri As String)
Dim Sdly7, SDL7, Sdlx7 As String
Open "C:\windows\SDL1.sd" For Output As #1
Print #1, Stri
Close
'================================================================
Open "C:\windows\SDL1.sd" For Input As #1
Line Input #1, SDL7
Close
Sdly7 = Replace(SDL7, "(", "")  '将左括号变为空
Sdly7 = Replace(Sdly7, ")", "")  '将右括号变为空
Sdly7 = Replace(Sdly7, ",", vbCrLf) '将","变为回车
Open "C:\windows\SDRLS.sd" For Output As #1
Print #1, Sdly7
Close
Open "C:\windows\SDRLS.sd" For Input As #1
Line Input #1, Sdlx7
Line Input #1, Sdlx7
Close
'================================================================
'================================================================
SubLY = Sdlx7
End Function
Public Function SubRX(ByVal Stri As String)
Dim Sdly7, SDL7, Sdlx7 As String
Open "C:\windows\SDL1.sd" For Output As #1
Print #1, Stri
Close
'================================================================
Open "C:\windows\SDL1.sd" For Input As #1
Line Input #1, SDL7
Close
Sdly7 = Replace(SDL7, "(", "")  '将左括号变为空
Sdly7 = Replace(Sdly7, ")", "")  '将右括号变为空
Sdly7 = Replace(Sdly7, ",", vbCrLf) '将","变为回车
Open "C:\windows\SDRLS.sd" For Output As #1
Print #1, Sdly7
Close
Open "C:\windows\SDRLS.sd" For Input As #1
Line Input #1, Sdlx7
Close
'================================================================
'================================================================
SubRX = Sdlx7
End Function
Public Function SubRY(ByVal Stri As String)
Dim Sdly7, SDL7, Sdlx7 As String
Open "C:\windows\SDL1.sd" For Output As #1
Print #1, Stri
Close
'================================================================
Open "C:\windows\SDL1.sd" For Input As #1
Line Input #1, SDL7
Close
Sdly7 = Replace(SDL7, "(", "")  '将左括号变为空
Sdly7 = Replace(Sdly7, ")", "")  '将右括号变为空
Sdly7 = Replace(Sdly7, ",", vbCrLf) '将","变为回车
Open "C:\windows\SDRLS.sd" For Output As #1
Print #1, Sdly7
Close
Open "C:\windows\SDRLS.sd" For Input As #1
Line Input #1, Sdlx7
Line Input #1, Sdlx7
Close
'================================================================
'================================================================
SubRY = Sdlx7
End Function
