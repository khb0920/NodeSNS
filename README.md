# Nodejs_Practice-2-

<br>
NodeSNS의 웹api 서버<br>
<br>

|Code|Message|
|--------|--------------------|
|200|JSON 데이터입니다|
|401|유효하지 않은 토큰입니다|
|410|버전을 업데이트 해주세요|
|419|토큰이 만료되었습니다|
|429|등급에따라 요청횟수가 제한됩니다|
|500~|서버 에러|
<br>

## 테스트
*get /test*
<br>

## posts 
* posts 조회

*get /posts/my*
<br>
<br>

* hashtag 조회

*get /posts/hashtag/:title*
    
    title => hashtag명 

<br>

## follow
* follow 조회
++ get /follow
<br>
    attribute = [id, nick]
