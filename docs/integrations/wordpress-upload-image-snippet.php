<?php
/**
 * Endpoint REST personalizado para subir imágenes a la Biblioteca de
 * Medios de WordPress desde TIBOX Connect (el portal), autenticado con
 * una clave secreta fija en vez de Application Passwords (descartadas
 * por problemas para activarlas en este sitio).
 *
 * Cómo instalarlo:
 *   1. Plugin Code Snippets → Add New.
 *   2. Pegar TODO este archivo (incluida la etiqueta <?php del inicio).
 *   3. Reemplazar el valor de $expected_secret más abajo por una clave
 *      larga y aleatoria propia (ej. generada con una contraseña
 *      aleatoria de 40+ caracteres) — NO dejar el valor de ejemplo.
 *   4. Guardar el snippet como "Solo funciones" (PHP) y activarlo con
 *      "Run snippet everywhere" (debe ejecutarse también en el contexto
 *      de la REST API, no solo en el admin).
 *   5. Copiar esa misma clave a la variable de entorno WP_UPLOAD_SECRET
 *      en Vercel (Project Settings → Environment Variables) — debe ser
 *      EXACTAMENTE igual en los dos lados.
 *
 * Endpoint resultante: POST https://www.tibox.cl/wp-json/tibox/v1/upload-image
 * Header requerido:    X-Tibox-Secret: <la misma clave>
 * Body:                multipart/form-data con un campo "file"
 * Respuesta exitosa:   { "url": "https://www.tibox.cl/wp-content/uploads/..." }
 * Respuesta de error:  { "code": "...", "message": "...", "data": { "status": ... } }
 */

add_action('rest_api_init', function () {
    register_rest_route('tibox/v1', '/upload-image', array(
        'methods'             => 'POST',
        'callback'            => 'tibox_handle_image_upload',
        // La validación real de acceso es la clave secreta dentro del
        // callback, no un usuario de WordPress — este endpoint no está
        // ligado a ninguna cuenta.
        'permission_callback' => '__return_true',
    ));
});

function tibox_handle_image_upload($request) {
    // 1) Validar la clave secreta.
    $expected_secret = 'REEMPLAZA_ESTO_POR_UNA_CLAVE_LARGA_Y_ALEATORIA_PROPIA';
    $provided_secret = $request->get_header('x-tibox-secret');

    if (!$provided_secret || !hash_equals($expected_secret, $provided_secret)) {
        return new WP_Error('tibox_invalid_secret', 'Clave inválida.', array('status' => 401));
    }

    // 2) Confirmar que llegó un archivo en el campo "file".
    $files = $request->get_file_params();
    if (empty($files['file'])) {
        return new WP_Error('tibox_no_file', 'No se recibió ningún archivo.', array('status' => 400));
    }

    $file = $files['file'];

    // 3) Restringir tipo y tamaño — mismo criterio que el resto del
    //    portal (JPG/PNG/WEBP, máximo 8MB).
    $allowed_types = array('image/jpeg', 'image/png', 'image/webp');
    if (!in_array($file['type'], $allowed_types, true)) {
        return new WP_Error('tibox_invalid_type', 'Formato no permitido. Usa JPG, PNG o WEBP.', array('status' => 400));
    }

    $max_bytes = 8 * 1024 * 1024;
    if ($file['size'] > $max_bytes) {
        return new WP_Error('tibox_too_large', 'La imagen supera el tamaño máximo permitido (8MB).', array('status' => 400));
    }

    // 4) Cargar las dependencias de wp-admin que media_handle_upload()
    //    necesita — no se cargan solas en el contexto de la REST API.
    require_once ABSPATH . 'wp-admin/includes/image.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';

    // 5) Subir a la Biblioteca de Medios. test_form=>false evita que
    //    media_handle_upload() exija el nonce de un formulario del
    //    admin — este endpoint no depende de una sesión de admin.
    $attachment_id = media_handle_upload('file', 0, array(), array('test_form' => false));

    if (is_wp_error($attachment_id)) {
        return new WP_Error('tibox_upload_failed', $attachment_id->get_error_message(), array('status' => 500));
    }

    $url = wp_get_attachment_url($attachment_id);

    return array('url' => $url);
}
