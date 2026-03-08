interface VisibilityBadgeProps {
  isPublic: boolean;
}

export const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({ isPublic }) => {
  return (
    <span className={`visibility-badge ${isPublic ? 'visibility-badge--public' : 'visibility-badge--private'}`}>
      {isPublic ? '🔓 Public' : '🔒 Private'}
    </span>
  );
};
