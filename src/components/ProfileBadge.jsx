import { User, Github } from 'lucide-react';
import { Badge } from './ui/Badge';

export const ProfileBadge = ({ profile }) => {
    if (!profile) return null;

    return (
        <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-white/5">
            <div className="relative">
                {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.username} className="w-12 h-12 rounded-full border border-white/10" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="text-text-secondary" />
                    </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface" />
            </div>

            <div>
                <h4 className="font-bold text-sm">{profile.name}</h4>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Github size={12} />
                    <span>@{profile.username}</span>
                </div>
            </div>

            <div className="ml-auto flex gap-2">
                <Badge variant="default">{profile.publicRepos} Repos</Badge>
                <Badge variant="primary">{profile.languages.length} Langs</Badge>
            </div>
        </div>
    );
};
