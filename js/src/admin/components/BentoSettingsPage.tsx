import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Switch from 'flarum/common/components/Switch';

const COLUMN_OPTIONS = ['2', '3', '4', '5', '6'];

function isTrue(v: unknown): boolean {
  return v === true || v === 1 || v === '1' || v === 'true';
}

export default class BentoSettingsPage extends ExtensionPage {
  className() {
    return 'BentoSettingsPage';
  }

  content() {
    const plainCreate = isTrue(this.setting('forumaker-bento.plain_create_button')());

    return (
      <div className="BentoSettingsPage">
        <div className="BentoSettingsPage-content">

          <section className="Bento-SettingsSection">
            <h3>
              <i className="fas fa-th" />
              {app.translator.trans('forumaker-bento.admin.settings.section_grid')}
            </h3>
            <div className="Bento-SettingsSection-content">

              <div className="Form-group">
                <label>{app.translator.trans('forumaker-bento.admin.settings.columns_desktop')}</label>
                <p className="helpText">
                  {app.translator.trans('forumaker-bento.admin.settings.columns_desktop_help')}
                </p>
                <div className="Bento-ColumnPicker">
                  {COLUMN_OPTIONS.map((n) => {
                    const active = String(this.setting('forumaker-bento.columns_desktop')() || '4') === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        className={'Bento-ColumnBtn' + (active ? ' is-active' : '')}
                        onclick={() => this.setting('forumaker-bento.columns_desktop')(n)}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="Form-group">
                <Switch
                  state={plainCreate}
                  onchange={(v: boolean) =>
                    this.setting('forumaker-bento.plain_create_button')(v ? '1' : '0')
                  }
                >
                  {app.translator.trans('forumaker-bento.admin.settings.plain_create_button')}
                </Switch>
                <p className="helpText">
                  {app.translator.trans('forumaker-bento.admin.settings.plain_create_button_help')}
                </p>
              </div>

            </div>
          </section>

          {this.submitButton()}
        </div>
      </div>
    );
  }
}
