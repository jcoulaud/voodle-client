import { useMemo } from 'react';

interface AvatarProps {
  userName: string;
  size?: number;
}

export default function Avatar({ userName, size = 32 }: AvatarProps) {
  const initials = useMemo(() => {
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  const backgroundColor = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }, [userName]);

  return (
    <div
      className='flex items-center justify-center rounded-full text-white'
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        fontSize: `${size / 2}px`,
      }}>
      {initials}
    </div>
  );
}
