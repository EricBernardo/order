$(document).ready(function () {

    event_calcule_order();

    $('.btn-product-add').click(function () {

        $('input[type="submit"], .btn-product-add').attr('disabled', true);

        $.ajax({
            url: base_url + 'product/all',
            type: 'GET',
            dataType: 'json'
        }).done(function (data) {

            let html = '';
            html += '<tr>';
            html += '<td>';
            html += '<div class="media">';
            html += '<div class="media-body">';

            html += '<select class="form-control" name="product_id[]">';
            $.each(data, function (key, value) {
                html += '<option data-price="' + value.price + '" value="' + value.id + '">' + value.title + '</option>';
            });
            html += '</select>';

            html += '</div>';
            html += '</div>';
            html += '</td>';
            html += '<td>';

            html += '<select class="form-control" name="quantity[]">';
            for (let x = 1; x <= 100; x++) {
                html += '<option>' + x + '</option>';
            }
            html += '</select>';

            html += '</td>';
            html += '<td>';
            html += '<div class="price-wrap">';
            $.each(data, function (key, value) {
                html += '<var class="price product-price">R$ ' + numberToReal(value.price) + '</var>';
                return false;
            });
            html += '</div>';
            html += '</td>';
            html += '<td class="text-right">';
            html += '<a class="btn btn-outline-danger btn-round btn-remove">Remover</a>';
            html += '</td>';
            html += '</tr>';

            $('tbody').append(html);

            calculate_order();
            event_calcule_order();

        }).always(function () {

            $('input[type="submit"], .btn-product-add').attr('disabled', false);

        });

    });

});

function calculate_order() {

    let subtotal = 0;
    let quantity_products = 0;
    let discount = $('[name="discount"]').val().replace('.', '').replace(',', '.');

    if (!discount) {
        discount = 0;
    }

    $('[name="product_id[]"').each(function () {

        let e = $(this);

        let price = e.parents('tr').find('[name="product_id[]"] > option:selected').attr('data-price');

        let quantity = parseInt(e.parents('tr').find('[name="quantity[]"]').val());

        if (price > 0) {

            subtotal += (price * quantity);

            quantity_products += quantity;

            e.parents('tr').find('.product-price').text('R$ ' + numberToReal(price * quantity));

        } else {

            e.parents('tr').find('.product-price').text('-');

        }

    });

    $('.order-total-product').text(quantity_products);
    $('.order-subtotal').text('R$ ' + numberToReal(subtotal.toFixed(2)));
    $('.order-discount').text('R$ ' + numberToReal(discount));

    if (subtotal >= discount) {

        $('.order-total').text('R$ ' + numberToReal(subtotal - discount));

    } else {

        $('[name="discount"]').val(0);

        calculate_order();

        alert('Desconto inválido!');

    }

}

function event_calcule_order() {

    $('[name="product_id[]"], [name="quantity[]"], [name="discount"]').unbind('change');
    $('[name="product_id[]"], [name="quantity[]"], [name="discount"]').change(function () {

        calculate_order();

    });

    event_remove_product();

}

function event_remove_product() {

    $('.btn-remove').unbind('click');

    $('.btn-remove').click(function () {

        if ($('.btn-remove').length > 1) {

            if (confirm('Deseja realmente fazer isso?')) {
                $(this).parents('tr').remove();
                calculate_order();
            }

        } else {
            alert('O pedido tem que ter pelo menos 1 produto');
        }

    });

}