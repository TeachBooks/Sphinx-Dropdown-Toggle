import os
from sphinx.locale import get_translation

from sphinx.application import Sphinx

MESSAGE_CATALOG_NAME = "dropdowntoggle"

try:
    from sphinx_dropdown_toggle._version import version as __version__
except ImportError:
    __version__ = "1.0.0"

def copy_javascript(app: Sphinx, exc):
    # Copy the JavaScript file to the output directory
    js_file = os.path.join(os.path.dirname(__file__), 'static', 'dropdown_toggle.js')
    
    # Get the translation function with the current app context
    try:
        translate = get_translation(MESSAGE_CATALOG_NAME, app.config.language)
    except Exception as e:
        print(f'Warning: Could not get translations for {app.config.language}: {e}')
        # Fallback to default (English) translations
        translate = get_translation(MESSAGE_CATALOG_NAME)
    
    with open(js_file,'r') as js:
        js_content = js.read()
        # Replace placeholders with actual translations
        print('Translating JavaScript content...')
        print('Current language:', app.config.language)
        
        close_all_trans = translate('Close all dropdowns')
        open_all_trans = translate('Open all dropdowns')
        mixed_state_trans = translate('Some dropdowns are open, some closed')
        
        print('Translation of "Close all dropdowns":', close_all_trans)
        print('Translation of "Open all dropdowns":', open_all_trans)
        print('Translation of "Some dropdowns are open, some closed":', mixed_state_trans)
        
        js_content = js_content.replace('Close all dropdowns', close_all_trans)
        js_content = js_content.replace('Open all dropdowns', open_all_trans)
        js_content = js_content.replace('Some dropdowns are open, some closed', mixed_state_trans)
        
    if app.builder.format == 'html' and not exc:
        staticdir = os.path.join(app.builder.outdir, '_static')
        # Ensure the static directory exists
        os.makedirs(staticdir, exist_ok=True)
        outfile = os.path.join(staticdir,'dropdown_toggle.js')
        with open(outfile,'w') as js:
            js.write(js_content)

def setup(app: Sphinx):
    # add translations first, before everything else
    package_dir = os.path.abspath(os.path.dirname(__file__))
    locale_dir = os.path.join(package_dir, "translations", "locales")
    app.add_message_catalog(MESSAGE_CATALOG_NAME, locale_dir)
    
    app.add_js_file('dropdown_toggle.js')
    app.connect('build-finished', copy_javascript)

    return {
        "version": __version__,
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
