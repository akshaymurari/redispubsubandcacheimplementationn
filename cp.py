for i in range(int(input())):
    n,m=map(int,input().split())
    print(pow(pow(2,n,10**9+7)-1,m,10**9+7))