import Head from 'next/head'
import AppLayout from '../Components/AppLayout'
import NicknameEditForm from '../Components/NicknameEditForm'
import FollowList from '../Components/FollowList'

const Profile = () => {
  const followerList = [{ nickname: '안나라수마나라' }, { nickname: '광등이' }, { nickname: '바보' }]
  const followingList = [{ nickname: '레드블루' }, { nickname: '연나라' }, { nickname: '부여성' }]

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  )
}

export default Profile