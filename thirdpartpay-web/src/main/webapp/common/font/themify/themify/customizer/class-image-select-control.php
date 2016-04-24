<?php
if (!defined('ABSPATH')) exit; // Exit if accessed directly

/**
 * Class to create a control to set the color of an element.
 *
 * @since 1.0.0
 */
class Themify_Image_Select_Control extends Themify_Control
{

    /**
     * Type of this control.
     * @access public
     * @var string
     */
    public $type = 'themify_image_select';

    /**
     * Render the control's content.
     *
     * @since 1.0.0
     */
    public function render_content()
    {
        $v = $this->value();
        $values = json_decode($v);
        $current = isset($values->selected) ? $values->selected : 'default';
        wp_enqueue_script('json2');
        ?>

        <?php if ($this->show_label && !empty($this->label)) : ?>
        <span class="customize-control-title themify-control-title"><?php echo esc_html($this->label); ?></span>
    <?php endif; ?>

        <div class="themify-customizer-brick">

            <?php
            if (isset($this->image_options)) {
                foreach ($this->image_options as $option => $image) {
                    echo '<a href="#" data-option="' . esc_attr($option) . '" class="image-select ' . $this->selected($option, $current) . '">';
                    echo '<img src="' . esc_url($image) . '" />';
                    echo '</a>';
                }
            }
            ?>

        </div>

        <input <?php $this->link(); ?> value='<?php echo esc_attr($v); ?>' type="hidden"
                                       class="<?php echo esc_attr($this->type); ?>_control themify-customizer-value-field"/>
        <?php
    }

    function selected($option, $current)
    {
        return $option == $current ? 'selected' : '';
    }
}