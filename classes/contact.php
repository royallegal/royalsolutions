<?php
$contact = new Contact();


class Contact {

    function __construct() {
        $this->post = array();
        $this->response = array(
            'status' => false,
            'error'  => 'Sorry, there was a problem ('.__LINE__.')',
            'data'   => false
        );

        add_action('wp_ajax_nopriv_contact_us_form', array($this, 'on_submit'));
        add_action('wp_ajax_contact_us_form', array($this, 'on_submit'));
    }


    public function on_submit() {
        // Get post data
        $this->post = array(
            'first'   => $_POST['first'],
            'last'    => $_POST['last'],
            'phone'   => $_POST['phone'],
            'email'   => $_POST['email'],
            'message' => $_POST['message']
        );

        // Validate post data
        foreach ($this->post as $key=>$data) {
            if (!$key == 'message') {
                $data = trim($data);
                $data = stripslashes($data);
                $data = htmlspecialchars($data);
            }

            if ($key == 'first' || $key == 'last') {
                $data = ucwords($data);
            }

            if ($key == 'phone') {
                $data = preg_replace('/[^0-9]/', '', $data);
            }

            if ($key == 'email') {
                $data = strtolower($data);
            }

            $this->post[$key] = $data;
        }

        // Enroll user in MailChimp
        /* if (new_user) {
         *     mailchimp();
         * }*/

        // Send emails via WordPress
        $this->send_emails();

        $this->response = array(
            'status' => true,
            'error'  => false,
            'data'   => $this->post
        );

        // Close connection
        $this->finish();
    }


    public function mailchimp() {
        $this->debug('MailChimp ('.__LINE__.')');
    }


    public function send_emails() {
        $email = new Email;

        // Admin Email(s)
        $email->
        from("Royal Legal Solutions <wordpress@royallegalsolutions.com>")->
        to("kellie@royallegalsolutions.com")->  // Use [$contact 1, $contact2, etc...] for multiple
        bcc("support@royallegalsolutions.com")->
        subject('New contact from Royal Legal Solutions')->
        template(get_template_directory().'/emails/contact_admin.html', [
            'name'    => $this->post['first'].' '.$this->post['last'],
            'phone'   => $this->post['phone'],
            'email'   => $this->post['email'],
            'message' => $this->post['message']
        ])->
        send();

        // Automated Response
        $email->
        from("Royal Legal Solutions <wordpress@royallegalsolutions.com>")->
        to($this->post['email'])->
        subject('Thank you for contacting Royal Legal Solutions')->
        template(get_template_directory().'/emails/contact_thankyou.html', [
	    'name'    => $this->post['first'],
	    'phone'   => $this->post['phone'],
	    'email'   => $this->post['email']
        ])->
        send();
    }


    private function finish() {
        json_encode($this->response);
        die();
    }


    private function debug($message) {
        echo json_encode($message);
        return true;
    }
}
?>
