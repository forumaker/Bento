import app from 'flarum/forum/app';
import { override } from 'flarum/common/extend';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import TagsPage from 'ext:flarum/tags/forum/components/TagsPage';

type TileData = {
  icon: string;
  label: any;
  href?: string;
  onclick?: (e: MouseEvent) => void;
  isPrimary: boolean;
  isDisabled: boolean;
  isActive: boolean;
};

function normalizeIcon(icon: string): string {
  if (!icon) return 'fas fa-circle';
  if (icon.includes(' ')) return icon;
  return `fas fa-${icon}`;
}

function extractItem(vnode: any): TileData | null {
  if (!vnode || typeof vnode !== 'object') return null;

  const attrs = vnode.attrs;
  if (!attrs || typeof attrs !== 'object') return null;

  const children: any[] = Array.isArray(vnode.children)
    ? vnode.children
    : vnode.children != null
    ? [vnode.children]
    : [];

  return {
    icon: normalizeIcon(attrs.icon || ''),
    label: children.find((c: any) => c != null && typeof c !== 'symbol') ?? null,
    href: attrs.href,
    onclick: attrs.onclick,
    isPrimary: typeof attrs.className === 'string' && attrs.className.includes('Button--primary'),
    isDisabled: attrs.disabled === true,
    isActive: attrs.active === true,
  };
}

function renderItem(data: TileData | null, key: string, prefix: string): Mithril.Children {
  if (!data) return null;

  const { icon, label, href, onclick, isPrimary, isDisabled, isActive } = data;

  const cls = [
    prefix,
    isPrimary && `${prefix}--primary`,
    isActive && `${prefix}--active`,
    isDisabled && `${prefix}--disabled`,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span className={`${prefix}-icon`} aria-hidden="true">
        <i className={`icon ${icon}`} />
      </span>
      <span className={`${prefix}-label`}>{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        key={key}
        className={cls}
        href={href}
        onclick={(e: MouseEvent) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          m.route.set(href);
        }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button key={key} type="button" className={cls} disabled={isDisabled} onclick={onclick}>
      {inner}
    </button>
  );
}

app.initializers.add('forumaker-bento', () => {
  override(IndexSidebar.prototype, 'view', function (this: any, original: () => any) {
    if (!TagsPage || !app.current.matches(TagsPage)) return original();
    if (window.matchMedia?.('(max-width: 768px)')?.matches) return original();

    const cols       = Number(app.forum.attribute('forumaker-bento.columns_desktop') || 4);
    const layout     = (app.forum.attribute('forumaker-bento.layout') as string)      || 'tiles';
    const pillShape = (app.forum.attribute('forumaker-bento.pill_shape') as string) || 'capsule';
    const plainCreate = app.forum.attribute<boolean>('forumaker-bento.plain_create_button');

    const newDiscData = extractItem(this.items().get('newDiscussion'));
    if (newDiscData && plainCreate) newDiscData.isPrimary = false;

    const allItems: Array<{ data: TileData; key: string }> = [];
    if (newDiscData) allItems.push({ data: newDiscData, key: 'newDiscussion' });
    for (const [i, vnode] of (this.navItems().toArray() as any[]).entries()) {
      const d = extractItem(vnode);
      if (d) allItems.push({ data: d, key: `nav-${i}` });
    }

    const navClass = 'IndexPage-sidebar Bento-sidebar';

    if (layout === 'pills') {
      const containerClass = [
        'Bento-pills',
        pillShape === 'rounded' && 'Bento-pills--rounded',
      ].filter(Boolean).join(' ');

      return (
        <nav
          className={navClass}
          style={{ '--bento-cols': String(cols) } as any}
        >
          <div className={containerClass}>
            {allItems.map(({ data, key }) => renderItem(data, key, 'Bento-pill'))}
          </div>
        </nav>
      );
    }

    return (
      <nav
        className={navClass}
        style={{ '--bento-cols': String(cols) } as any}
      >
        <div className="Bento-grid">
          {allItems.map(({ data, key }) => renderItem(data, key, 'Bento-tile'))}
        </div>
      </nav>
    );
  });
});
