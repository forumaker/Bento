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

function extractItem(vnode: any): TileData | null {
  if (!vnode || typeof vnode !== 'object') return null;

  const attrs = vnode.attrs || {};
  const children: any[] = Array.isArray(vnode.children)
    ? vnode.children
    : vnode.children != null
    ? [vnode.children]
    : [];

  return {
    icon: attrs.icon || 'fas fa-circle',
    label: children.find((c: any) => c != null && typeof c !== 'symbol') ?? null,
    href: attrs.href,
    onclick: attrs.onclick,
    isPrimary: (attrs.className || '').includes('Button--primary'),
    isDisabled: attrs.disabled === true,
    isActive: attrs.active === true,
  };
}

function renderTile(data: TileData | null, key: string): Mithril.Children {
  if (!data) return null;

  const { icon, label, href, onclick, isPrimary, isDisabled, isActive } = data;

  const cls = [
    'Bento-tile',
    isPrimary && 'Bento-tile--primary',
    isActive && 'Bento-tile--active',
    isDisabled && 'Bento-tile--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span className="Bento-tile-icon" aria-hidden="true">
        <i className={icon} />
      </span>
      <span className="Bento-tile-label">{label}</span>
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
    if (!app.current.matches(TagsPage)) return original();
    if (window.matchMedia?.('(max-width: 768px)')?.matches) return original();

    const cols = Number(app.forum.attribute('forumaker-bento.columns_desktop') || 4);
    const plainCreate = app.forum.attribute<boolean>('forumaker-bento.plain_create_button');

    const newDiscData = extractItem(this.items().get('newDiscussion'));
    if (newDiscData && plainCreate) newDiscData.isPrimary = false;

    const tiles: Mithril.Vnode[] = [];

    const newDiscTile = renderTile(newDiscData, 'newDiscussion');
    if (newDiscTile) tiles.push(newDiscTile as Mithril.Vnode);

    for (const [i, vnode] of (this.navItems().toArray() as any[]).entries()) {
      const tile = renderTile(extractItem(vnode), `nav-${i}`);
      if (tile) tiles.push(tile as Mithril.Vnode);
    }

    return (
      <nav className="IndexPage-sidebar Bento-sidebar" style={{ '--bento-cols': String(cols) } as any}>
        <div className="Bento-grid">{tiles}</div>
      </nav>
    );
  });
});
