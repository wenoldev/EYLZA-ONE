import type { HeaderConfig } from '../../types/Header';

const TopBar = ({ config }: { config: HeaderConfig }) => {
    if (!config.topBar?.show) return null;

    return (
        <div
            className="text-white text-[11px] uppercase tracking-wider font-semibold h-10"
            style={{
                backgroundColor: config.topBar.backgroundColor || config.general.backgroundColor,
                color: config.topBar.textColor || config.general.textColor,
            }}
        >
            <div className={`h-full px-6 flex items-center justify-center gap-8`}>
                <div dangerouslySetInnerHTML={{ __html: config.topBar.content }} />
            </div>
        </div>
    );
};

export default TopBar;
