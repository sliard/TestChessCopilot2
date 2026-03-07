interface SkeletonLineProps {
  width?: string;
  height?: string;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = '1rem',
}) => {
  return (
    <div
      className="skeleton skeleton-line"
      style={{ width, height }}
    />
  );
};

interface SkeletonAvatarProps {
  size?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = '3rem',
}) => {
  return (
    <div
      className="skeleton skeleton-avatar"
      style={{ width: size, height: size }}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3 }) => {
  return (
    <div className="skeleton-card card">
      <SkeletonLine width="60%" height="1.25rem" />
      <div className="skeleton-card-body">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            width={i === lines - 1 ? '80%' : '100%'}
          />
        ))}
      </div>
    </div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="skeleton-card card">
      <div className="skeleton-card-body">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} style={{ display: 'flex', gap: '1rem' }}>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <SkeletonLine
                key={colIdx}
                width={`${100 / columns}%`}
                height="0.875rem"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonPage: React.FC = () => {
  return (
    <div className="page">
      <div className="container">
        <SkeletonLine width="40%" height="2rem" />
        <div style={{ marginTop: '1.5rem' }}>
          <SkeletonCard lines={4} />
          <SkeletonCard lines={2} />
        </div>
      </div>
    </div>
  );
};

