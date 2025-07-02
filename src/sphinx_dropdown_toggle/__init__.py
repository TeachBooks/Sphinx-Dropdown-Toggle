from sphinx.application import Sphinx

try:
    from sphinx_dropdown_toggle._version import version as __version__
except ImportError:
    __version__ = "1.0.0"

def setup(app: Sphinx):
    app.add_css_file('image_dark_mode.css')
    app.add_config_value('inverter_saturation',1.5,'env')
    app.add_config_value('inverter_all',True,'env')
    app.connect('build-finished', copy_stylesheet)
    return {
        "version": __version__,
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
